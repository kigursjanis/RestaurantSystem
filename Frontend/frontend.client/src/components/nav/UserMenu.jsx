import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';

const UserMenu = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

   
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="user-menu" ref={menuRef}>
            <img
                src={user?.profile_picture_url || "https://via.placeholder.com/30"}
                alt="Profile"
                className="profile-pic"
                onClick={() => setIsOpen(!isOpen)}
            />

            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-header">
                        <img
                            src={user?.profile_picture_url || "https://via.placeholder.com/30"}
                            alt="Profile"
                            className="dropdown-profile-pic"
                        />
                        <span className="username">{user?.username}</span>
                    </div>

                    <div className="dropdown-items">
                        <button onClick={() => {
                            navigate(`/user/${user.username}`);
                            setIsOpen(false);
                        }}>
                            Profile
                        </button>
                        <button onClick={() => {
                            navigate('/settings');
                            setIsOpen(false);
                        }}>
                            Settings
                        </button>
                        <button onClick={() => {
                            onLogout();
                            setIsOpen(false);
                        }}>
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;