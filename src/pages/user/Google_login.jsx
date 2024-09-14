import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Google_Login({ onLoginSuccess }) { // onLoginSuccess prop to handle login in the parent component
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setUser(tokenResponse);
            onLoginSuccess(tokenResponse); // Call the parent function when login is successful
        },
        onError: (error) => console.log('Login Failed:', error),
    });

    useEffect(() => {
        if (user) {
            // Fetch the user profile using the access_token
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json',
                    },
                })
                .then((res) => {
                    setProfile(res.data);
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    return (
        <div>
            {profile ? (
                <div>
                    <img src={profile.picture} alt="user image" />
                    <h3>{profile.name}</h3>
                    <p>{profile.email}</p>
                </div>
            ) : (
                <button
                    className="google-login-button" // You can style this button according to your needs
                    onClick={login}
                >
                    Sign in with Google 🚀
                </button>
            )}
        </div>
    );
}

export default Google_Login;
