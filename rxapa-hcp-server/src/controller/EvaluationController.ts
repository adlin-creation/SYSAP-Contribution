
const { Evaluation } = require("../model/Evaluation_PACE");

exports.getEvaluation = async (req: any, res: any) =>{
    try{
        res.status(200).json({ message: "GET req to evaluation page."});
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.createEvalution = async (req, res) => {
    try {
        const newEvaluation = await Evaluation.create(req.body);
        res.status(201).json(newEvaluation);
    } catch (error) {
        res.status(400).json({ nessage: "Error creating evalution"});
    }
};