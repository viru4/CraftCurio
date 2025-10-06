import jwt from 'jsonwebtoken'

const genToken = async (userId) => {
    try {
        const token = await jwt.verify({userId}, process.env.JWT_SECRET, {expiresIn:"7d"})
        return token
    } catch (error) {
        return res.status(500).json(`Token error ${error}`)
    }
}

export default genToken