import React, { useState } from 'react';
import { CronJob } from '../../types/cpanel';
import { 
  Clock, 
  PlusCircle, 
  Trash2, 
  Check, 
  X, 
  Sliders, 
  AlertCircle 
} from 'lucide-react';

interface CronJobsAppProps {
  cronJobs: CronJob[];
  onUpdateCronJobs: (jobs: CronJob[]) => void;
  onClose: () => void;
}

export const CronJobsApp: React.FC<CronJobsAppProps> = ({
  cronJobs,
  onUpdateCronJobs,
  onClose
}) => {
  const [commonPreset, setCommonPreset] = useState('daily');
  const [minute, setMinute] = useState('0');
  const [hour, setHour] = useState('2');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [weekday, setWeekday] = useState('*');
  const [command, setCommand] = useState('/usr/local/bin/php /home/demouser/public_html/cron.php >/dev/null 2>&1');
  const [description, setDescription] = useState('Automated task runner');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplyPreset = (val: string) => {
    setCommonPreset(val);
    switch (val) {
      case 'minute':
        setMinute('*'); setHour('*'); setDay('*'); setMonth('*'); setWeekday('*');
        break;
      case 'fifteen':
        setMinute('*/15'); setHour('*'); setDay('*'); setMonth('*'); setWeekday('*');
        break;
      case 'hourly':
        setMinute('0'); setHour('*'); setDay('*'); setMonth('*'); setWeekday('*');
        break;
      case 'daily':
        setMinute('0'); setHour('0'); setDay('*'); setMonth('*'); setWeekday('*');
        break;
      case 'weekly':
        setMinute('0'); setHour('0'); setDay('*'); setMonth('*'); setWeekday('0');
        break;
      case 'monthly':
        setMinute('0'); setHour('0'); setDay('1'); setMonth('*'); setWeekday('*');
        break;
    }
  };

  const handleAddCron = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const newJob: CronJob = {
      id: `cron_${Date.now()}`,
      minute,
      hour,
      day,
      month,
      weekday,
      command: command.trim(),
      description: description.trim() || 'Custom cron task',
      active: true,
    };

    onUpdateCronJobs([...cronJobs, newJob]);
    showToast(`Added cron job schedule: ${minute} ${hour} ${day} ${month} ${weekday}`);
    setCommand('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this scheduled cron task?')) {
      onUpdateCronJobs(cronJobs.filter(c => c.id !== id));
      showToast('Cron job deleted.');
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-[82vh] overflow-hidden">
      {/* Toast alert */}
      {toastMessage && (
        <div className="absolute top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2 rounded-md shadow-xl border border-slate-700 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="px-4 py-3 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#ff6c2c]" />
          <h2 className="text-sm font-semibold">Cron Jobs (Task Scheduler)</h2>
          <span className="text-[11px] text-slate-400 font-mono">({cronJobs.length} active crons)</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
        {/* Add Cron Job Form */}
        <form onSubmit={handleAddCron} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Add New Cron Job
          </h3>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Common Settings Presets:</label>
            <select
              value={commonPreset}
              onChange={(e) => handleApplyPreset(e.target.value)}
              className="w-full sm:w-80 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            >
              <option value="minute">Once Per Minute (* * * * *)</option>
              <option value="fifteen">Every 15 Minutes (*/15 * * * *)</option>
              <option value="hourly">Once An Hour (0 * * * *)</option>
              <option value="daily">Once A Day at Midnight (0 0 * * *)</option>
              <option value="weekly">Once A Week on Sunday (0 0 * * 0)</option>
              <option value="monthly">Once A Month on the 1st (0 0 1 * *)</option>
            </select>
          </div>

          {/* 5 Cron fields */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Minute (0-59)</label>
              <input
                type="text"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Hour (0-23)</label>
              <input
                type="text"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Day (1-31)</label>
              <input
                type="text"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Month (1-12)</label>
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Weekday (0-6)</label>
              <input
                type="text"
                value={weekday}
                onChange={(e) => setWeekday(e.target.value)}
                className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Command to Execute:</label>
            <input
              type="text"
              required
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="/usr/local/bin/php /home/demouser/public_html/cron.php"
              className="w-full px-3 py-2 font-mono text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-[#ff6c2c]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400 font-mono">
              Schedule: {minute} {hour} {day} {month} {weekday}
            </span>
            <button
              type="submit"
              className="px-4 py-2 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add New Cron Job</span>
            </button>
          </div>
        </form>

        {/* Current Cron Jobs Table */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Current Cron Jobs ({cronJobs.length})
          </h3>

          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 uppercase text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-2.5 px-3 font-mono text-center">Schedule</th>
                  <th className="py-2.5 px-4 font-mono">Command</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                {cronJobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 text-center text-[#ff6c2c] font-bold whitespace-nowrap">
                      {job.minute} {job.hour} {job.day} {job.month} {job.weekday}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-sm truncate">
                      {job.command}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-sans">
                      {job.description}
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Cron"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
