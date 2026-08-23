import { Attendee, Session } from '../types';

export function exportContactVCard(contact: Attendee) {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${contact.name}`,
    `ORG:${contact.company}`,
    `TITLE:${contact.role}`,
    `EMAIL;TYPE=INTERNET,WORK:${contact.email}`,
    contact.phone ? `TEL;TYPE=CELL:${contact.phone}` : '',
    contact.linkedin ? `URL;TYPE=LinkedIn:${contact.linkedin}` : '',
    contact.github ? `URL;TYPE=GitHub:${contact.github}` : '',
    `NOTE:Met at Bifrost Summit '24 - Pass ${contact.id}. ${contact.bio || ''}`,
    'END:VCARD'
  ].filter(Boolean).join('\r\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${contact.name.toLowerCase().replace(/\s+/g, '_')}_bifrost.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSessionICS(session: Session) {
  const dtStart = '20241024T100000Z';
  const dtEnd = '20241024T111500Z';

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bifrost Summit//Agenda Session//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${session.title} - ${session.room}`,
    `DESCRIPTION:${session.description}\\n\\nSpeaker: ${session.speaker.name} (${session.speaker.role}, ${session.speaker.company})`,
    `LOCATION:Bifrost Summit - ${session.room}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${session.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
