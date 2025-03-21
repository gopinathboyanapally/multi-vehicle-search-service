import { Router } from 'express';
import { body } from "express-validator";
import { getLocations } from '../handlers/locationHandler.mjs';

const router = Router();
  
router.post('/',
    [
        // Validate that the request body is a non-empty array.
        body().custom(value => {
            if (!Array.isArray(value) || value.length === 0) {
                throw new Error('Request body must be a non-empty array.');
            }

            return true;
        })
    ],
    getLocations
);

export default router;