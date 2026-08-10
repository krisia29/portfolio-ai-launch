UPDATE public.assignments SET
  title = 'Week 7 — Building Your App Prototype',
  est_minutes = 60,
  difficulty = 'beginner',
  platform = 'Replit',
  objectives = ARRAY['Use Replit Agent to turn your app plan into a working web prototype'],
  lesson = $lesson${
 "version": 1,
 "objective": "Create the first working version of your AI-powered app in Replit by using Replit Agent to turn your app concept and planning work into a functional web prototype.",
 "estimatedMinutes": 60,
 "difficulty": "beginner",
 "overview": "You've spent the first six weeks planning your app. You have already developed your app idea, identified your users, researched your topic, planned your features, created your user journey, and designed your branding.\n\nNow you're going to turn those ideas into something you can actually interact with.\n\nIn this assignment, you will use Replit Agent, Replit's AI-powered app builder. Instead of starting with a blank project or writing code from scratch, you will describe your app in plain English. Replit Agent will use your instructions to create the first version of your app.\n\nThink of this as giving an AI software developer a project brief. You provide the ideas and instructions; Replit Agent helps turn them into a working prototype.",
 "successCriteria": [
  "A working web prototype is generated in Replit from your own app plan",
  "The prototype includes your app name, main features, and key screens",
  "The design reflects your branding colors and overall style",
  "An App_Revisions document lists at least three changes for future assignments",
  "Your Replit project is named to match your app"
 ],
 "steps": [
  {
   "id": "step-1",
   "title": "Step 1 \u2014 Review Your Previous Work",
   "body": "1. From your repository, gather the following items that you will use to describe your app to Replit Agent:\n\n- App name\n- App description\n- Target user/persona\n- Planned features\n- User journey\n- App workflow\n- Color palette\n- Logo"
  },
  {
   "id": "step-2",
   "title": "Step 2 \u2014 Open Replit",
   "body": "1. Go to [replit.com](https://replit.com) and sign in using GitHub.\n2. Under the prompt box, Replit may display several project types. Select **Website**.\n3. Copy the prompt below into Replit and replace the bracketed sections with information from your previous assignments.\n\n(\nCreate a responsive web app prototype called [APP NAME].\n\nThe app is designed for [TARGET USER] and solves this problem: [PROBLEM YOUR APP SOLVES].\n\nThe main purpose of the app is: [APP PURPOSE].\n\nInclude these main features:\n- [FEATURE 1]\n- [FEATURE 2]\n- [FEATURE 3]\n- [FEATURE 4]\n- [FEATURE 5]\n\nCreate a simple, beginner-friendly user experience based on the user journey I developed for this project.\n\nInclude these main screens:\n- Home\n- [SCREEN 2 FROM YOUR USER JOURNEY]\n- [SCREEN 3 FROM YOUR USER JOURNEY]\n- [SCREEN 4, IF NEEDED]\n\nUse the following visual style:\n- Primary color: [COLOR]\n- Secondary color: [COLOR]\n- Overall style: [MODERN / PLAYFUL / PROFESSIONAL / MINIMAL / ETC.]\n\nUse my app branding and logo concept where appropriate.\n\nMake the design responsive so that it works on both desktop and phone-sized screens.\n\nUse realistic sample information so that I can interact with the prototype.\n\nDo not add unnecessary features that are not part of my original app concept.\n\nThe goal is to create a functional prototype that demonstrates how my app would work, not a finished commercial product.\n)\n\n4. Screenshot your prompt before submitting.\n\n/evidence\n\n5. Do not close the browser while Replit Agent is building your project. The process may take several minutes.",
   "evidence": {
    "title": "Upload your prompt screenshot",
    "required": true,
    "optional": false,
    "maxFiles": 5,
    "maxSizeMb": 50,
    "allowLinks": true,
    "acceptedFiles": ["png","jpg","jpeg","pdf","docx","pptx","zip"],
    "reflectionPrompt": "Add a short note about what this file shows."
   }
  },
  {
   "id": "step-3",
   "title": "Step 3 \u2014 Review the Replit Agent Result",
   "body": "1. Spend a few minutes exploring the preview as if you were a real user. Validate the following:\n\n- Does the app name appear correctly?\n- Does the home screen make sense?\n- Can you find the main features?\n- Can you move between screens?\n- Does the design match your branding?\n- Does the app make sense for your target user?"
  },
  {
   "id": "step-4",
   "title": "Step 4 \u2014 Compare Your Prototype With Your Original Plan",
   "body": "1. Open your previous assignments and compare them with what Replit created. Ask yourself:\n\n- What did Replit understand correctly?\n- What is different from my original idea?\n- What would I change?\n\n2. In a new document, write down at least three changes you want to make in future assignments. For example: Change the home screen colors.\n3. Save the document as **App_Revisions** and save it in your repository.\n\n/evidence",
   "evidence": {
    "title": "Upload your App_Revisions document",
    "required": true,
    "optional": false,
    "maxFiles": 5,
    "maxSizeMb": 50,
    "allowLinks": true,
    "acceptedFiles": ["png","jpg","jpeg","pdf","docx","pptx","zip"],
    "reflectionPrompt": "Add a short note about what this file shows."
   }
  },
  {
   "id": "step-5",
   "title": "Step 5 \u2014 Save Your Replit Project",
   "body": "1. Confirm that your project has a clear name that matches your app."
  }
 ],
 "checklist": [
  "Gathered planning materials from your repository",
  "Prompt customized with your app details and screenshotted",
  "Prototype reviewed screen by screen",
  "App_Revisions document saved to your repository",
  "Replit project renamed to match your app"
 ],
 "resources": [
  {"label": "Replit", "url": "https://replit.com"},
  {"label": "Replit Agent docs", "url": "https://docs.replit.com/replitai/agent"}
 ]
}$lesson$::jsonb,
  created_at = '2026-07-06 20:09:08.700000+00'
WHERE id = '34ef6426-fe99-4f95-ac90-6e8e6c23e6cc';