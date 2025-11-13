const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all books (Authenticated users)
router.get('/', auth, async (req, res) => {
    try {
        const books = await Book.find()
            .populate('addedBy', 'username')
            .sort({ createdAt: -1 });
            res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single book
router.get('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        .populate('addedBy', 'username');
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
    
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add book (Admin only)
router.post('/', auth, admin, async (req, res) => {
    try {
        const { title, author, isbn, publishedYear, genre, description } = req.body;

        const book = new Book({
        title,
        author,
        isbn,
        publishedYear,
        genre,
        description,
        addedBy: req.user._id
        });

        await book.save();
        await book.populate('addedBy', 'username');

        res.status(201).json(book);
    } catch (error) {
        if (error.code === 11000) {
        return res.status(400).json({ message: 'Book with this ISBN already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update book (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const { title, author, isbn, publishedYear, genre, description } = req.body;

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, isbn, publishedYear, genre, description },
            { new: true, runValidators: true }
        ).populate('addedBy', 'username');

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete book (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;