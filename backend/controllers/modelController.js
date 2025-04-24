import axios from '../config/axiosConfig.js';

const handleSummarize = async (req, res) => {
    const { text } = req.body;

    if(!req.user) {
        return res.status(404).send('User Not Found');
    }

    if(!text && text.length === 0) {
        return res.status(400).send('Wrong Submission');
    }
    await axios.post('/summarize', { text }, { timeout: 60000 })
        .then(response => {
            const data = response.data;
            return res.status(200).json(data);
        })
        .catch(error => {
            console.log('Error summarising text: ', error);
            return res.status(500).json(error);
        });
};

const handleBulletify = async (req, res) => {
    const { text } = req.body;

    if(!req.user) {
        return res.status(404).send('User Not Found');
    }

    if(!text && text.length === 0) {
        return res.status(400).send('Wrong Submission');
    }
    await axios.post('/bulletify', { text }, { timeout: 60000 })
        .then(response => {
            const data = response.data;
            return res.status(200).json(data);
        })
        .catch(error => {
            console.log('Error bulletining text: ', error);
            return res.status(500).json(error);
        });
};

const handleParaphrase = async (req, res) => {
    const { text } = req.body;

    if(!req.user) {
        return res.status(404).send('User Not Found');
    }

    if(!text && text.length === 0) {
        return res.status(400).send('Wrong Submission');
    }
    await axios.post('/paraphrase', { text }, { timeout: 60000 })
        .then(response => {
            const data = response.data;
            return res.status(200).json(data);
        })
        .catch(error => {
            console.log('Error paraphrasing text: ', error);
            return res.status(500).json(error);
        });
};

const handleProofread = async (req, res) => {
    const { text } = req.body;

    if(!req.user) {
        return res.status(404).send('User Not Found');
    }

    if(!text && text.length === 0) {
        return res.status(400).send('Wrong Submission');
    }
    await axios.post('/proofread', { text }, { timeout: 60000 })
        .then(response => {
            const data = response.data;
            return res.status(200).json(data);
        })
        .catch(error => {
            console.log('Error proofreading text: ', error);
            return res.status(500).json(error);
        });
};

export {
    handleSummarize,
    handleBulletify,
    handleParaphrase,
    handleProofread,
};