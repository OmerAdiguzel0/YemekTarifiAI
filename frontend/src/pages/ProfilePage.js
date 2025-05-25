import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function getToken() {
  return localStorage.getItem('token');
}

function decodeToken(token) {
  if (!token) return {};
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return {};
  }
}

const cardStyle = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 2px 12px #e3e6f3',
  padding: 32,
  marginBottom: 32,
  maxWidth: 500,
  marginLeft: 'auto',
  marginRight: 'auto',
};

const labelStyle = {
  color: '#3949ab',
  fontWeight: 'bold',
  fontSize: 16,
  marginBottom: 8,
  display: 'block',
};

const inputStyle = {
  width: '100%',
  padding: 12,
  borderRadius: 8,
  border: '1px solid #bbb',
  marginBottom: 18,
  fontSize: 16,
  background: '#f8f9fa',
};

const buttonStyle = {
  width: '100%',
  background: '#3949ab',
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: 8,
  padding: 14,
  fontSize: 16,
  marginTop: 8,
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const buttonAltStyle = {
  ...buttonStyle,
  background: '#0089df',
};

const ProfilePage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    const payload = decodeToken(token);
    setEmail(payload.email || '');
    setUsername(payload.username || '');
    setNewUsername(payload.username || '');
  }, []);

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    if (!newUsername) {
      alert('Lütfen yeni kullanıcı adını girin');
      return;
    }
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/auth/change-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newUsername })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kullanıcı adı değiştirilemedi');
      localStorage.setItem('token', data.token);
      setUsername(newUsername);
      alert('Kullanıcı adınız başarıyla değiştirildi');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !newPasswordRepeat) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }
    if (newPassword !== newPasswordRepeat) {
      alert('Yeni şifreler aynı değil');
      return;
    }
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Şifre değiştirilemedi');
      alert('Şifreniz başarıyla değiştirildi');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordRepeat('');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '48px 0' }}>
      <div style={{ ...cardStyle, marginBottom: 40, textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 12, position: 'relative' }}>
          <IconButton 
            onClick={handleBack}
            sx={{
              mr: 3,
              color: '#1a237e',
              '&:hover': { bgcolor: 'rgba(26, 35, 126, 0.04)' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <h2 style={{ color: '#3949ab', fontSize: 28, position: 'absolute', left: 0, right: 0, textAlign: 'center', margin: 0 }}>
            Profil Bilgileri
          </h2>
        </div>
        <div style={{ fontSize: 18, color: '#888', marginBottom: 6 }}>Email</div>
        <div style={{ color: '#3949ab', fontWeight: 500, fontSize: 20, marginBottom: 18 }}>{email}</div>
        <div style={{ fontSize: 18, color: '#888', marginBottom: 6 }}>Kullanıcı Adı</div>
        <div style={{ color: '#3949ab', fontWeight: 500, fontSize: 20 }}>{username}</div>
      </div>

      <form onSubmit={handleChangeUsername} style={cardStyle}>
        <div style={{ marginBottom: 18, textAlign: 'center' }}>
          <span style={{ ...labelStyle, fontSize: 18 }}>Kullanıcı Adı Değiştir</span>
        </div>
        <input
          type="text"
          value={newUsername}
          onChange={e => setNewUsername(e.target.value)}
          style={inputStyle}
          autoComplete="off"
        />
        <button type="submit" disabled={loading} style={buttonAltStyle}>
          {loading ? 'Değiştiriliyor...' : 'Kullanıcı Adını Değiştir'}
        </button>
      </form>

      <form onSubmit={handleChangePassword} style={cardStyle}>
        <div style={{ marginBottom: 18, textAlign: 'center' }}>
          <span style={{ ...labelStyle, fontSize: 18 }}>Şifre Değiştir</span>
        </div>
        <input
          type="password"
          placeholder="Mevcut Şifre"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Yeni Şifre"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Yeni Şifre (Tekrar)"
          value={newPasswordRepeat}
          onChange={e => setNewPasswordRepeat(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage; 