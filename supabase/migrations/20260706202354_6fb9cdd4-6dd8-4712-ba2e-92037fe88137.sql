UPDATE public.modules SET prereq_module_id = NULL WHERE prereq_module_id = 'a058584e-3613-4ed8-8f3f-23aefac1ba98';
DELETE FROM public.submissions WHERE assignment_id IN (SELECT id FROM public.assignments WHERE module_id = 'a058584e-3613-4ed8-8f3f-23aefac1ba98');
DELETE FROM public.class_assignments WHERE assignment_id IN (SELECT id FROM public.assignments WHERE module_id = 'a058584e-3613-4ed8-8f3f-23aefac1ba98');
DELETE FROM public.assignments WHERE module_id = 'a058584e-3613-4ed8-8f3f-23aefac1ba98';
DELETE FROM public.modules WHERE id = 'a058584e-3613-4ed8-8f3f-23aefac1ba98';
UPDATE public.modules SET order_index = order_index - 1 WHERE order_index > 2;