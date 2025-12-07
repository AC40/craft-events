# Craft Events

**A free, privacy-focused event scheduling tool integrated with Craft documents**

---

## What is Craft Events?

Craft Events is a simple web tool that lets you create event scheduling pages directly in your Craft documents. Think of it as a free alternative to Doodle—no ads, no sign-ups, and no data collection. You can easily find the best time for meetings, events, or gatherings by letting people vote on their availability.

### The Use Case

Have you ever needed to schedule a meeting or event with multiple people? Instead of sending endless emails back and forth asking "when are you free?", Craft Events lets you:

- Create a scheduling page in your Craft document
- Share a simple link with all participants
- Let everyone vote on their availability
- See the results instantly in a clear table format

Perfect for team meetings, social gatherings, interviews, or any event where you need to coordinate multiple people's schedules. All the scheduling data lives right in your Craft document, so it's easy to reference later and fits seamlessly into your existing workflow.

### Key Features

- **Easy Scheduling**: Create event pages with multiple time slots in seconds
- **Secure**: Your API credentials are protected and encrypted
- **Share Instantly**: Share voting links with anyone—no Craft accounts needed for participants
- **Live Results**: See current availability anytime, synced from your Craft document
- **Privacy First**: No database storage, no tracking, your credentials stay safe

---

## How It Works

### For Event Organizers

**Step 1: Connect to Craft**

Enter your Craft API URL and optional API key. Your credentials are immediately encrypted and protected.

**Step 2: Choose Your Document**

Select which Craft document you want to create the event in from a list of your documents.

**Step 3: Create Your Event**

Fill in the event details:

- Event title
- Description (optional)
- Location (optional)
- Select available time slots (dates and times)

A new page is automatically created in your Craft document with a scheduling table.

**Step 4: Share with Participants**

Copy the voting link and share it with anyone who needs to vote. They don't need Craft accounts.

**Step 5: View Results**

Check the results page anytime to see who's available when. The results update automatically as people vote.

### For Participants

**Step 1: Get the Link**

Receive a voting link from the event organizer.

**Step 2: Vote**

Enter your name and click on the time slots you're available for.

**Step 3: Submit**

Your votes are immediately saved to the Craft document.

**Step 4: See Results**

View the results page to see everyone's availability at a glance.

---

## Privacy & Security

### What We Store

**Nothing on our servers.** Your data stays in your Craft document and your browser.

### How We Protect Your Information

- Your API credentials are encrypted before being used
- Credentials are only decrypted temporarily on the server when needed
- Decrypted information is immediately discarded after use
- Your credentials never appear in your browser or network logs
- Event history is stored only in your browser, never sent to any server

### What We Never See

- Your actual API credentials (they're encrypted)
- Participant names (stored only in your Craft document)
- Votes (written directly to Craft, never stored by us)

---

## How Events Are Stored

Events are created as tables in your Craft document. The table shows:

- Participant names in the first column
- Time slots across the top
- Checkmarks (✅) showing who's available when

The table updates automatically as people vote, and you can see the results anytime by refreshing the results page.

---

## Getting Started

You have two options to use Craft Events:

### Option 1: Use the Hosted Version

The easiest way to get started is to use the hosted version:

1. Visit [craft-events.aaronrichter.tech](https://craft-events.aaronrichter.tech)
2. Connect to your Craft account using your API URL (and optional API key)
3. Select a document and create your first event
4. Share the voting link with participants

No setup required—just visit the website and start using it!

### Option 2: Self-Host Your Own Instance

If you prefer to run your own instance or want to customize the code:

1. Fork the repository: [https://github.com/AC40/craft-events](https://github.com/AC40/craft-events)
2. Follow the setup guide in the repository's README
3. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)
4. Set your environment variables and start using your own instance

This gives you full control over the code and lets you customize it to your needs.

### What You'll Need

- A Craft account with API access
- Your Craft API URL (and optional API key)
- A web browser

---

## Future Ideas

Some features we're considering:

- Support for recurring events
- Email notifications
- Calendar integration
- Multiple timezone support
- More voting options (maybe/yes/no)
- Export results to different formats

---

## About This Project

Craft Events is built with modern web technologies and follows privacy-first principles. The code is open source, so you can review how everything works and verify that your data stays safe.

### Project Submission

This project was created for Craft's Winter Challenge. It demonstrates a practical integration with Craft's API that solves a real-world problem—event scheduling—while maintaining strict privacy and security standards. The application showcases:

- Seamless integration with Craft documents
- Secure handling of API credentials
- User-friendly interface for both organizers and participants
- Privacy-first architecture with no data collection
- Open source codebase for transparency

The project is fully functional and ready to use, either through the hosted version or by self-hosting your own instance.
