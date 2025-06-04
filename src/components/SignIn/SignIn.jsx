import React, { useState } from 'react';
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
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          // Đăng nhập thành công, xử lý lưu user/session ở đây
          alert('Login successful!');
          onClose && onClose();
        } else {
          setErrors({ ...errors, password: data.error || 'Login failed' });
        }
      } catch (err) {
        setErrors({ ...errors, password: 'Server error' });
      }
    }
  };

  const handleGoogleLogin = () => {
    console.log('Login with Google');
    // Implement Google login logic here
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
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
          </div>

          <div className={styles.forgotPassword}>
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <div className={styles.submitButton}>
            <Button variant="primary" onClick={handleSubmit}>Sign In</Button>
          </div>
          
        <div className={styles.orDivider}>
          <span>OR</span>
        </div>
      
        <div className={styles.googleButtonBottom}>
            <GoogleButton onClick={handleGoogleLogin} />
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