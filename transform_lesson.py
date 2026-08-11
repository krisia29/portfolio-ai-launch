import json
import sys

with open('lesson.json', 'r') as f:
    lesson = json.load(f)

if lesson and 'steps' in lesson:
    for step in lesson['steps']:
        # Point 1: Change "Upload Evidence" to "Upload Screenshot"
        if 'evidence' in step and step['evidence'].get('title') == 'Upload Evidence':
            step['evidence']['title'] = 'Upload Screenshot'
        
        # Points 2-7: Remove checklist items from step 7 body
        if step['id'] == 'step-7' and 'body' in step:
            body = step['body']
            lines_to_remove = [
                "Committed the Week2_AppIdea document to your GitHub repository",
                "Wrote and uploaded your final app idea section",
                "Submission Checklist",
                "Generated three AI-powered mobile app ideas in ChatGPT",
                "Saved the three ideas in a Word document titled Week2_AppIdea",
                "Uploaded a screenshot of the ChatGPT comparison"
            ]
            
            new_lines = []
            for line in body.split('\n'):
                content = line.strip()
                match_found = False
                for target in lines_to_remove:
                    if target in content:
                        match_found = True
                        break
                
                if match_found:
                    new_lines.append("")
                else:
                    new_lines.append(line)
            
            step['body'] = '\n'.join(new_lines)

with open('updated_lesson.json', 'w') as f:
    json.dump(lesson, f)
