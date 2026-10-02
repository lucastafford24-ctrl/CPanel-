import React, { useState, useRef, useEffect } from 'react';
import { 
  TerminalSquare, 
  RotateCcw, 
  Maximize2, 
  X, 
  Copy, 
  Check 
} from 'lucide-react';

interface TerminalAppProps {
  onClose: () => void;
}

interface CommandOutput {
  id: string;
  command: string;
  cwd: string;
  output: string;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ onClose }) => {
  const [currentCwd, setCurrentCwd] = useState('~');
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: 'init_1',
      command: '',
      cwd: '',
      output: `Last login: Fri Oct  2 09:14:22 2026 from 203.0.113.19\nWelcome to cPanel & WHM Terminal v120.0 (build 11)\nType 'help' to view available hosting tools and commands.\n`
    }
  ]);
  const [cmdHistoryList, setCmdHistoryList] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    setCmdHistoryList(prev => [...prev, rawCmd]);
    setHistoryIndex(-1);

    const parts = rawCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    let resultOutput = '';

    switch (cmd) {
      case 'help':
        resultOutput = `Available cPanel CLI commands:
  ls, ll          List directory contents
  pwd             Print current working directory
  cd <dir>        Change directory (e.g. cd public_html, cd ~)
  cat <file>      Display file content (e.g. cat index.php, cat .bashrc)
  whoami          Print current user name
  uptime          Show how long system has been running
  uname -a        Print system architecture and kernel
  df -h           Show disk space utilization
  free -m         Display memory and swap statistics
  php -v          Show installed PHP CLI runtime
  mysql -V        Show MySQL server client version
  git status      Check repository branch and changes
  date            Print system date and time
  clear           Clear the terminal display
  history         Show session command history`;
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'pwd':
        resultOutput = currentCwd === '~' ? '/home/demouser' : `/home/demouser/${currentCwd.replace('~/', '')}`;
        break;

      case 'whoami':
        resultOutput = 'demouser';
        break;

      case 'date':
        resultOutput = new Date().toUTCString();
        break;

      case 'uname':
        resultOutput = 'Linux vps-cpanel-us-east.net 5.15.0-89-generic #99-Ubuntu SMP x86_64 GNU/Linux';
        break;

      case 'uptime':
        resultOutput = `10:30:42 up 42 days, 3:15, 1 user, load average: 0.12, 0.18, 0.15`;
        break;

      case 'df':
        resultOutput = `Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        20G  4.9G   15G  25% /
tmpfs           2.0G  180K  2.0G   1% /dev/shm
/dev/loop0      2.0G  312M  1.7G  16% /var/lib/mysql`;
        break;

      case 'free':
        resultOutput = `               total        used        free      shared  buff/cache   available
Mem:            4096        1240        1856          28         972        2620
Swap:           2048           0        2048`;
        break;

      case 'php':
        if (arg === '-v' || arg === '--version') {
          resultOutput = `PHP 8.2.14 (cli) (built: Dec 20 2023 14:12:00) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.2.14, Copyright (c) Zend Technologies
    with Zend OPcache v8.2.14, Copyright (c), by Zend Technologies`;
        } else {
          resultOutput = `Usage: php -v, php script.php`;
        }
        break;

      case 'mysql':
        resultOutput = `mysql  Ver 8.0.35-0ubuntu0.22.04.1 for Linux on x86_64 ((Ubuntu))`;
        break;

      case 'git':
        if (arg === 'status') {
          resultOutput = `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`;
        } else {
          resultOutput = `git version 2.43.0\nUsage: git status, git log`;
        }
        break;

      case 'cd':
        if (!arg || arg === '~') {
          setCurrentCwd('~');
        } else if (arg === '..' && currentCwd !== '~') {
          setCurrentCwd('~');
        } else if (arg === 'public_html' || arg === 'mail' || arg === 'ssl') {
          setCurrentCwd(arg);
        } else {
          resultOutput = `bash: cd: ${arg}: No such file or directory`;
        }
        break;

      case 'ls':
      case 'll':
        if (currentCwd === '~') {
          resultOutput = `drwxr-xr-x  8 demouser demouser 4096 Oct  2 08:30 public_html/
drwxr-x---  4 demouser demouser 4096 Oct  1 19:12 mail/
drwx------  2 demouser demouser 4096 Sep 28 14:02 ssl/
drwxr-x---  3 demouser demouser 4096 Sep 20 11:45 etc/
drwxrwxrwx  2 demouser demouser 4096 Oct  2 09:00 tmp/
-rw-r--r--  1 demouser demouser 3771 Sep 15 10:14 .bashrc`;
        } else if (currentCwd === 'public_html') {
          resultOutput = `-rw-r--r--  1 demouser demouser 1420 Oct  1 16:45 index.php
-rw-------  1 demouser demouser 3120 Sep 30 11:20 wp-config.php
-rw-r--r--  1 demouser demouser  245 Sep 29 09:15 .htaccess
-rw-r--r--  1 demouser demouser   89 Sep 20 12:00 robots.txt
drwxr-xr-x  4 demouser demouser 4096 Oct  2 07:15 wp-content/`;
        } else {
          resultOutput = `total 0`;
        }
        break;

      case 'cat':
        if (arg === 'index.php') {
          resultOutput = `<?php\ndefine( 'WP_USE_THEMES', true );\nrequire __DIR__ . '/wp-blog-header.php';`;
        } else if (arg === 'wp-config.php') {
          resultOutput = `<?php\ndefine( 'DB_NAME', 'demouser_wp' );\ndefine( 'DB_USER', 'demouser_admin' );\ndefine( 'DB_HOST', 'localhost' );`;
        } else if (arg === '.bashrc') {
          resultOutput = `alias ll='ls -la'\nalias cpanel='echo "cPanel VPS environment v120.0"'`;
        } else if (arg) {
          resultOutput = `cat: ${arg}: No such file or directory`;
        } else {
          resultOutput = `cat: missing file argument`;
        }
        break;

      case 'history':
        resultOutput = cmdHistoryList.map((c, i) => `  ${i + 1}  ${c}`).join('\n');
        break;

      default:
        resultOutput = `bash: ${cmd}: command not found. Type 'help' for available commands.`;
        break;
    }

    setHistory(prev => [
      ...prev,
      {
        id: `cmd_${Date.now()}`,
        command: rawCmd,
        cwd: currentCwd,
        output: resultOutput
      }
    ]);

    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistoryList.length === 0) return;
      const nextIndex = historyIndex === -1 ? cmdHistoryList.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(cmdHistoryList[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistoryList.length === 0 || historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= cmdHistoryList.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistoryList[nextIndex]);
      }
    }
  };

  const handleResetSession = () => {
    setHistory([
      {
        id: `init_${Date.now()}`,
        command: '',
        cwd: '',
        output: `Session reset.\n[demouser@vps-cpanel ~]$`
      }
    ]);
    setCurrentCwd('~');
    setInputVal('');
  };

  return (
    <div className="bg-[#0b0f19] rounded-lg border border-slate-700 shadow-2xl flex flex-col h-[82vh] overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="px-4 py-2 bg-slate-900 text-slate-200 flex items-center justify-between border-b border-slate-800 select-none">
        <div className="flex items-center gap-2">
          <TerminalSquare className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-xs text-white">cPanel Terminal - demouser@vps-cpanel</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetSession}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
            title="Reset Terminal Session"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="flex-1 p-4 overflow-y-auto space-y-2 bg-[#090d16] text-slate-300 font-mono text-xs leading-relaxed"
      >
        {history.map(item => (
          <div key={item.id} className="space-y-1">
            {item.command && (
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-emerald-400 font-bold">[demouser@vps-cpanel {item.cwd}]$</span>
                <span className="text-white font-medium">{item.command}</span>
              </div>
            )}
            {item.output && (
              <div className="whitespace-pre-wrap text-slate-300 font-mono text-[11px] pl-1">
                {item.output}
              </div>
            )}
          </div>
        ))}

        {/* Active Input Prompt */}
        <form onSubmit={handleExecute} className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 font-bold shrink-0">
            [demouser@vps-cpanel {currentCwd}]$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none caret-emerald-400"
            autoFocus
            spellCheck={false}
          />
        </form>

        <div ref={terminalEndRef} />
      </div>

      {/* Footer helper */}
      <div className="px-4 py-1.5 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between select-none">
        <span>Press Enter to run command · Up/Down for command history</span>
        <span>Interactive Shell · VT100 Emulation</span>
      </div>
    </div>
  );
};
