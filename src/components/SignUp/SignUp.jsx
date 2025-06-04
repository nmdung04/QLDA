import React, { useState } from 'react';
import Button from '../Button/Button';
import styles from './SignUp.module.scss';

const SignUp = ({ onClose, onToggleForm }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    const newErrors = { 
      fullName: '',
      email: '', 
      password: '', 
      confirmPassword: '' 
    };

    // Validate fullName
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
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

    // Validate confirmPassword
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation is required';
      valid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,  // Gửi fullName đến API
            // fullName sẽ được lưu thêm ở dưới
          }),
        });
        const data = await res.json();
        if (res.ok) {
          // Sau khi đăng ký thành công, cập nhật tên người dùng vào DB
          // (nếu API chưa hỗ trợ fullName, có thể cập nhật ở đây)
          // Hoặc show thông báo thành công
          alert('Registration successful! You can now sign in.');
          onToggleForm && onToggleForm();
        } else {
          // Hiển thị lỗi trả về từ API
          setErrors({ ...errors, email: data.error || 'Registration failed' });
        }
      } catch (err) {
        setErrors({ ...errors, email: 'Server error' });
      }
    }
  };

  return (
    <div className={styles.signUpContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.closeButton} onClick={onClose}>
          &times;
        </div>
        <h2 className={styles.title}>Sign Up</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? styles.errorInput : ''}
            />
            {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
          </div>

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

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? styles.errorInput : ''}
            />
            {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
          </div>

          <div className={styles.termsAgreement}>
            <input type="checkbox" id="terms" name="terms" />
            <label htmlFor="terms">
              I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
            </label>
          </div>

          <div className={styles.submitButton}>
            <Button variant="primary" onClick={handleSubmit}>Sign Up</Button>
          </div>

          <div className={styles.signInLink}>
            Already have an account?{' '}
            <a href="#" onClick={(e) => {
              e.preventDefault();
              onToggleForm();
            }}>Sign In</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
