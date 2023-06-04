insert into public.questionnaires (title, instructions)
values ('Emulated Initial Screening Questionnaire for Mental Health', 'Answer each question on a scale of 0 to 3, where 0 is ''Not at all'', 1 is ''Several day'', 2 is ''More than half the days'', and 3 is ''Nearly every day''.');

insert into public.questions (text, questionnaires_id)
values 
('Over the last two weeks, how often have you been bothered by feeling down, depressed, or hopeless?', 1),
('Over the last two weeks, how often have you been bothered by little interest or pleasure in doing things?', 1),
('Over the last two weeks, how often have you been bothered by feeling nervous, anxious, or on edge?', 1),
('Over the last two weeks, how often have you been bothered by not being able to stop or control worrying?', 1),
('Over the last two weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?', 1),
('Over the last two weeks, how often have you been bothered by feeling tired or having little energy?', 1),
('Over the last two weeks, how often have you been bothered by poor appetite or overeating?', 1),
('Over the last two weeks, how often have you been bothered by feeling bad about yourself - or that you are a failure or have let yourself or your family down?', 1),
('Over the last two weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?', 1),
('Over the last two weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself in some way?', 1);
