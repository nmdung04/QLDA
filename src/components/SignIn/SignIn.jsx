import React, { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import Button from '../Button/Button';
import styles from './SignIn.module.scss';
import GoogleButton from '../GoogleButton/GoogleButton';

const SignIn = ({ onClose, onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('userSession', data.user._id);
          onClose && onClose();
          window.dispatchEvent(new Event('userSessionChanged'));
          window.location.href = '/';
        } else {
          setErrors({ ...errors, password: data.error || 'Login failed' });
        }
      } catch (err) {
        setErrors({ ...errors, password: 'Server error' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/'
      });
      
      if (result?.ok) {
        // Đăng nhập thành công
        const session = await getSession();
        if (session) {
          // Lưu session info vào localStorage để tương thích với code hiện tại
          localStorage.setItem('userSession', session.user.email);
          localStorage.setItem('userInfo', JSON.stringify(session.user));
          
          onClose && onClose();
          window.dispatchEvent(new Event('userSessionChanged'));
          window.location.href = '/';
        }
      } else if (result?.error) {
        console.error('Google login error:', result.error);
        setErrors({ ...errors, password: 'Google login failed. Please try again.' });
      }
    } catch (error) {
      console.error('Google login error:', error);
      setErrors({ ...errors, password: 'Google login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signInContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.closeButton} onClick={onClose}>
          &times;
        </div>
        <h2 className={styles.title}>Sign In</h2>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ''}
              disabled={isLoading}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.errorInput : ''}
              disabled={isLoading}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
          </div>

          <div className={styles.forgotPassword}>
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <div className={styles.submitButton}>
            <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
          
          <div className={styles.orDivider}>
            <span>OR</span>
          </div>
        
          <div className={styles.googleButtonBottom}>
            <GoogleButton 
              onClick={handleGoogleLogin} 
              text={isLoading ? 'Signing in...' : 'Sign in with Google'}
            />
          </div>
          
          <div className={styles.signUpLink}>
            Don't have an account? <a href="#" onClick={(e) => {
                e.preventDefault();
                onToggleForm()
            }}>Sign up now</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;