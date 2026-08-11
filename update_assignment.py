import os
import json
import psycopg2
from psycopg2.extras import Json

conn = psycopg2.connect(os.environ["DATABASE_URL"])
cur = conn.cursor()

# 1. Fetch the lesson JSON for the specific assignment
assignment_id = 'aa841efa-0f07-4d48-81eb-41a3d7c41ec3'
cur.execute("SELECT lesson FROM assignments WHERE id = %s", (assignment_id,))
lesson = cur.fetchone()[0]

# 2. Update the lesson JSON
# - Change "Upload Evidence" to "Upload Screenshot" in evidence configs
# - Remove specific lines from Step 7 body (the checklist and its header)
#   The lines requested for removal are actually the checklist items and the "Submission Checklist" header.
#   The user wants to replace them with "\n" which effectively removes them but preserves spacing.

if lesson and 'steps' in lesson:
    for step in lesson['steps']:
        if 'evidence' in step and step['evidence'].get('title') == 'Upload Evidence':
            step['evidence']['title'] = 'Upload Screenshot'
        
        if step['id'] == 'step-7' and 'body' in step:
            body = step['body']
            
            # The user wants to change specific lines to "\n"
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
                # Check if the line (stripped of markdown list markers like "- [ ] ") matches
                content = line.strip()
                if content.startswith("- [ ] "):
                    content = content[6:].strip()
                elif content.startswith("### "):
                    content = content[4:].strip()
                
                if content in lines_to_remove:
                    new_lines.append("") # Replace with blank line
                else:
                    new_lines.append(line)
            
            step['body'] = '\n'.join(new_lines)

# 3. Save the updated lesson JSON back to the database
cur.execute("UPDATE assignments SET lesson = %s WHERE id = %s", (Json(lesson), assignment_id))
conn.commit()
cur.close()
conn.close()
