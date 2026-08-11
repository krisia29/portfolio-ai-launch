import os
import json
import subprocess

# 1. Fetch the lesson JSON for the specific assignment
assignment_id = 'aa841efa-0f07-4d48-81eb-41a3d7c41ec3'
cmd = ["psql", os.environ["DATABASE_URL"], "-t", "-c", f"SELECT lesson FROM assignments WHERE id = '{assignment_id}';"]
result = subprocess.run(cmd, capture_output=True, text=True)
lesson_str = result.stdout.strip()
lesson = json.loads(lesson_str)

# 2. Update the lesson JSON
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

# 3. Save the updated lesson JSON back to the database
updated_lesson = json.dumps(lesson)
# Escape single quotes for SQL
updated_lesson_escaped = updated_lesson.replace("'", "''")
cmd = ["psql", os.environ["DATABASE_URL"], "-c", f"UPDATE assignments SET lesson = '{updated_lesson_escaped}' WHERE id = '{assignment_id}';"]
subprocess.run(cmd, check=True)
