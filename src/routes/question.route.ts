import { Router } from 'express';
import { authenticateAdmin } from '../middlewares/auth.middleware';
import { createQuestion, deleteQuestion, editQuestion, getQuestionById } from '../controller/question.controller';
import { createQuestionValidationRules, editQuestionValidationRules } from '../validation/question.validation';
import { validate } from '../helpers/validation.helper';

const router = Router();

router.get('/:id', getQuestionById);
router.post('/', authenticateAdmin, createQuestionValidationRules, validate, createQuestion);
router.put('/:id', authenticateAdmin, editQuestionValidationRules, validate, editQuestion);
router.delete('/:id', authenticateAdmin, deleteQuestion);

export default router;
