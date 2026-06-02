const { success } = require("zod")

const validate = (schema)=> async (req, res, next) => {
    try {
        await schema.parseAsync(req.body)
        next()
    } catch (error) {
        if(error instanceof z.ZodError){
            const formatterError = error.errors.map(err=>({
                field: err.path.join('-'),
                message: err.message
            }))
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: formatterError
        })
        }
        next(error)
        
    }
}
module.exports = validate