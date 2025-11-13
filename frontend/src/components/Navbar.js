import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
  
    return (
        <nav className="navbar">
            <h1>📚 Library System</h1>
            <ul>
                {user ? (
                <>
                    <li>
                        <Link to="/books">Books</Link>
                    </li>

                    {user.role === 'admin' && (
                        <li>
                            <Link to="/add-book">Add Book</Link>
                        </li>
                    )}

                    <li>
                        <span>
                            {user.username} ({user.role})
                        </span>
                    </li>

                    <li>
                        <button onClick={logout}>Logout</button>
                    </li>
                </>
                ) : (
                <>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;