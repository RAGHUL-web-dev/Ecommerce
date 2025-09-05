const sendToken = (user, statusCode, res) => {

    const token = user.getJwtToken();


    const option = {
        expires : new Date(Date.now() + process.env.COOKIES_EXPIRES_TIME * 24 * 60 * 60 *1000),
        httpOnly : true,
    }

    res.status(statusCode)
    .cookie('token', token, option)
    .json({
        success : true,
        message : "Success Fully login",
        user,
        token
    })
}

module.exports = sendToken;