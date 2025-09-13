# Vercel Environment Variables Setup

To fix the Firebase Admin initialization error, you need to set up the following environment variables in your Vercel dashboard:

## Required Environment Variables

1. **FIREBASE_PROJECT_ID**
   - Value: `amala-atlas`

2. **FIREBASE_PRIVATE_KEY**
   - Value: `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDItm0eJchsGLEW\nv0N7/0rl9kuHuTT3Xpcj1jR9auql9TkIie0twPq1mJSfTYVidCE1kDRJJPfH3Y9A\nFNmCvTWjGLfD1qdcY/bdGlO5lQea6kAUdYj1lJIzIhhzhN5HudI2PoaSy15OS4tz\nu9/LlZfdO0MpacK3NHpDzNaqZ0grFlTVAgowmD+f8unGXKvm1V+Zck8i996ipltb\n8WRgfvJwDhnYIggZ44t/bqpD1AkU5rsEhP/tYhr5u94dGO3V8bTPp8eJ1S2dK+F4\nBsMdiV5mKF6HzN71bFAp28vELWhv2LgcDAWXG089Rt5kWhVMNIhZh9ybmpe7DM6g\nf8v6chltAgMBAAECggEAALiKbuWYV6KJoIXIi4gRswuk53zl9t+HQzC3jRhj4/lR\nF3cekgZQvCEn5HoNQLGLjA6AiPYfsZPYsE8OhbHGE+to3t+lGA5F8Lu3GrJ4/gP/\nirmBoU4qsPNHyLwoX+TaU5CKHnj6HVIaITr9B7kmShQDonqKLE7KS0TvIaRQ2o9V\nFfPzjDsTlFrV8kGqsf5uo9hTmNKRngc31T9AK5eDKxkubYKHtyd5/9bGOHpoLBqx\n/3n9i3sFt5e2PWdqfOJxFb0X4lldCceOa6A9Lnzgg3L5yss5dKqW7iQxh3nzLSjQ\nSrgOJgAFZoPOBHQ3A4WER3TvZdEsJ+PsAOl3dvw5oQKBgQDkCZzcnyK0OoB+AMVL\n8zYcp1v3kvLu9YMv6WWLAbr354pe9oS7M9NohMrMpzsbP/rS+8rnRz+vRTIXDB6U\nxhKQ4Uozqjczh56HsMbThPv1iwT7Ua50pfhXh+3n/M0I8m7BPGdiqoYfBnkw6zQq\nOhxHRsFvtZKOE9w9hzKUKEG9IQKBgQDhUwx/548gIPf3kFmorx/8DhojV6IX1e1J\nFzJop7o+V76YGsh7S5CUimj+8CLQeOrtxOk6SAwOmSTTRwOePu6ua3pfM1tggqKM\nlTUTVl2BywGX5eOYzg5FU1pJP9WRakfmd/XfYPUp18OZvA0Zdz8tmnnEt2+3ytb/\n/Gf8H6LmzQKBgQCBOsFedgCgypaO0bj9tbLwwhdoUirCKPhTap1VDYH7g4fzERlf\nTZt9G+Qh3pOsebGXZ4IxVztMBJbCYOfjv+w9lq8KYGgwF6dLlm7W6AIxwLruAfgv\nuu7mC+5TDfzUGS+S6rxcOe8QHgcIJgLF+3CTJBHzUJ7hTXf+lmOfesDmgQKBgB2X\niZm2sI5YphhGRfAoZ7vzoi0oEiqtNseVm1IxTP1pCqfxRIkkyG0prFZm9TuJ1di6\nNqMn2SWFqVdyCSCcRT508RJVrVeEcJKj+d97RTaJkcEAOR7VWPxz0PSzxHmfiqfS\n82CN3ETNiGvFTbcdeRelJP7X1H0/z3K5FHMBOKS1AoGBAJqVi+sz6fNrd0cziJLo\nYbvR5NsnPNcJWzlHHuU1DZm5eCQwntvq1Ze7Rf4ZsV634/JbhGaag97csQQFG+Q2\nM/OaFU7N2p/r3KK2pKsXEaeOeSBHUV0E4u8i/1gN2z3Ww5WcM8gfg7G6C7p5W9kb\nF8G+bbvl3sX3bP1DtaNxDij0\n-----END PRIVATE KEY-----\n`

3. **FIREBASE_CLIENT_EMAIL**
   - Value: `firebase-adminsdk-fbsvc@amala-atlas.iam.gserviceaccount.com`

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Navigate to your project: `amala-atlas`
3. Go to Settings → Environment Variables
4. Add each variable above with the exact values provided
5. Make sure to set them for "Production", "Preview", and "Development" environments
6. Redeploy your application

## Additional Environment Variables (if using NextAuth)

If you're using NextAuth with Google OAuth, you'll also need:

- **GOOGLE_CLIENT_ID** - Your Google OAuth Client ID
- **GOOGLE_CLIENT_SECRET** - Your Google OAuth Client Secret  
- **NEXTAUTH_SECRET** - A random secret string for NextAuth
- **NEXTAUTH_URL** - Your Vercel app URL (e.g., `https://amala-atlas-oon3.vercel.app`)

## After Setting Environment Variables

1. The app will automatically redeploy
2. Check the Vercel function logs to see if Firebase initializes successfully
3. Test your API endpoints to ensure they're working

## Troubleshooting

If you still get errors after setting the environment variables:
1. Check that the private key includes the `\n` characters (newlines)
2. Verify all environment variable names match exactly
3. Check the Vercel function logs for specific error messages
