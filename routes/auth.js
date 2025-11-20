const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const passport = require('passport');

// OAuth routes with guards so attempting to use an unconfigured strategy returns a friendly error
router.get('/google', (req, res, next) => {
	if (!passport._strategy || !passport._strategy('google')) {
		console.warn('Google OAuth requested but strategy not configured')
		return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_not_configured`)
	}
	return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
});

router.get('/google/callback', (req, res, next) => {
	if (!passport._strategy || !passport._strategy('google')) {
		console.warn('Google callback invoked but strategy not configured')
		return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_not_configured`)
	}
	passport.authenticate('google', { session: false }, (err, payload) => {
		if (err) {
			console.error('Google OAuth error:', err)
			return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=oauth`)
		}
		if (!payload || !payload.token) {
			console.error('Google OAuth completed but no token payload')
			return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=no_token`)
		}
		const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/oauth?token=${payload.token}`;
		return res.redirect(redirectUrl);
	})(req, res, next);
});

router.get('/facebook', (req, res, next) => {
	if (!passport._strategy || !passport._strategy('facebook')) {
		console.warn('Facebook OAuth requested but strategy not configured')
		return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=facebook_not_configured`)
	}
	return passport.authenticate('facebook', { scope: ['email'] })(req, res, next)
});

router.get('/facebook/callback', (req, res, next) => {
	if (!passport._strategy || !passport._strategy('facebook')) {
		console.warn('Facebook callback invoked but strategy not configured')
		return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=facebook_not_configured`)
	}
	passport.authenticate('facebook', { session: false }, (err, payload) => {
		if (err) {
			console.error('Facebook OAuth error:', err)
			return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=oauth`)
		}
		if (!payload || !payload.token) {
			console.error('Facebook OAuth completed but no token payload')
			return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=no_token`)
		}
		const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/oauth?token=${payload.token}`;
		return res.redirect(redirectUrl);
	})(req, res, next);
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);

module.exports = router;
