# Customer Time Tracking System

A real-time customer time tracking system built with Next.js 14, TypeScript, and Tailwind CSS. This application helps businesses track customer arrival times, service start times, and completion times, similar to a Google Sheets time logging system but with a modern, responsive interface.

## Features

- **Real-Time Clock Display**: Displays current time with automatic updates
- **Time Tracking Operations**:
  - Log customer arrival time
  - Record service start time
  - Record service completion time
- **Automatic Duration Calculations**:
  - Wait Time (time between arrival and service start)
  - Order Time (time between service start and completion)
  - Total Time (time from arrival to completion)
- **Data Management**:
  - Persistent storage using localStorage
  - Export data to Excel (.xlsx) format
  - Reset functionality to clear all entries
- **Modern UI Components**:
  - Clean, responsive design
  - Built with shadcn components
  - Dark mode support
  - Mobile-friendly interface

## Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn
- **State Management**: React Hooks
- **Data Export**: XLSX library
- **Data Persistence**: localStorage

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Usage

1. **Logging Customer Arrival**
   - Click "Log Arrival" when a customer arrives
   - A new entry is created with the current timestamp

2. **Starting Service**
   - Click "Start" on a customer's entry when service begins
   - Wait time calculation starts automatically

3. **Completing Service**
   - Click "End" when service is completed
   - All time calculations are updated automatically

4. **Exporting Data**
   - Click "Export to Excel" to download a spreadsheet of all entries
   - File includes timestamps and duration calculations
   - Filename includes current date for easy reference

5. **Resetting Data**
   - Click "Reset Data" to clear all entries
   - Confirmation is required to prevent accidental deletion

## Data Structure

Each time entry includes:
- **ID**: Unique identifier (timestamp)
- **Date**: Current date
- **Arrival Time**: When customer arrived
- **Start Time**: When service began
- **End Time**: When service completed
- **Wait Time**: Duration between arrival and start
- **Order Time**: Duration between start and end
- **Total Time**: Total duration from arrival to completion

## Future Enhancements

- Backend integration for permanent data storage
- User authentication and multiple user support
- Statistical analysis and reporting
- Customer queue management
- SMS/Email notifications
- Service type categorization
- Staff assignment tracking
- Custom time slot scheduling

## License

[MIT License](LICENSE)
