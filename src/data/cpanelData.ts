import {
  CPanelTool,
  CategoryInfo,
  ServerStats,
  FileItem,
  EmailAccount,
  DnsRecord,
  DatabaseRecord,
  CronJob,
  WordPressSite,
  VisitorLog,
  SystemNotification
} from '../types/cpanel';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'email', title: 'Email', description: 'Create email accounts, configure forwarders, spam filters, and autoresponders.' },
  { id: 'files', title: 'Files', description: 'Manage site files, backup data, examine disk storage, and configure FTP accounts.' },
  { id: 'databases', title: 'Databases', description: 'Administer MySQL databases with phpMyAdmin and manage database user privileges.' },
  { id: 'domains', title: 'Domains', description: 'Configure DNS zone records, manage subdomains, aliases, and redirect rules.' },
  { id: 'metrics', title: 'Metrics', description: 'Monitor live visitor logs, analyze bandwidth consumption, and track errors.' },
  { id: 'security', title: 'Security', description: 'Manage SSL/TLS certificates, AutoSSL, SSH keys, IP blocking, and Hotlink guard.' },
  { id: 'software', title: 'Software', description: 'Install apps with WordPress Toolkit, select PHP versions, and configure php.ini.' },
  { id: 'advanced', title: 'Advanced', description: 'Run SSH Terminal, configure scheduled cron jobs, and manage Apache handlers.' },
  { id: 'preferences', title: 'Preferences', description: 'Update password & security, change theme style, and configure user contact info.' },
];

export const INITIAL_STATS: ServerStats = {
  currentUser: 'demouser',
  primaryDomain: 'example-corp.com',
  sharedIp: '198.51.100.42',
  homeDir: '/home/demouser',
  lastLogin: 'Today at 09:14 AM from 203.0.113.19',
  serverName: 'vps-cpanel-us-east.net',
  cpanelVersion: '120.0 (build 11)',
  apacheVersion: '2.4.58',
  phpVersion: '8.2.14',
  mysqlVersion: '8.0.35',
  architecture: 'x86_64',
  os: 'Linux 5.15.0-89-generic',
  sendmailPath: '/usr/sbin/sendmail',
  perlPath: '/usr/bin/perl',
  diskUsedGb: 4.82,
  diskTotalGb: 20.0,
  mysqlDiskUsedMb: 312.4,
  bandwidthUsedGb: 14.2,
  bandwidthTotalGb: 100.0,
  emailAccountsCount: 4,
  emailAccountsMax: 25,
  subdomainsCount: 3,
  subdomainsMax: 10,
  addonDomainsCount: 2,
  addonDomainsMax: 5,
  inodesUsed: 42190,
  inodesMax: 250000,
  memoryUsedMb: 1240,
  memoryTotalMb: 4096,
  cpuPercent: 12,
  entryProcessesUsed: 2,
  entryProcessesMax: 30,
  ioUsageKbps: 180,
  ioLimitKbps: 1024,
};

export const CPANEL_TOOLS: CPanelTool[] = [
  // Email
  { id: 'email-accounts', name: 'Email Accounts', description: 'Create and manage email addresses, passwords, and disk quotas.', category: 'email', iconName: 'Mail', appTarget: 'email-accounts', badge: 'Popular' },
  { id: 'forwarders', name: 'Forwarders', description: 'Send copies of incoming mail from one address to another automatically.', category: 'email', iconName: 'CornerUpRight', appTarget: 'email-accounts' },
  { id: 'email-routing', name: 'Email Routing', description: 'Configure whether email is handled locally or routed to external mail exchangers.', category: 'email', iconName: 'GitBranch', appTarget: 'email-accounts' },
  { id: 'autoresponders', name: 'Autoresponders', description: 'Configure automated out-of-office vacation replies for mailboxes.', category: 'email', iconName: 'MessageSquareText', appTarget: 'email-accounts' },
  { id: 'default-address', name: 'Default Address', description: 'Catch all unrouted emails sent to invalid addresses on your domain.', category: 'email', iconName: 'Inbox', appTarget: 'email-accounts' },
  { id: 'track-delivery', name: 'Track Delivery', description: 'Review email delivery routes, spam scores, and bounce reports.', category: 'email', iconName: 'Send', appTarget: 'email-accounts' },
  { id: 'spam-filters', name: 'Spam Filters', description: 'Configure Apache SpamAssassin score thresholds and spam box options.', category: 'email', iconName: 'ShieldAlert', appTarget: 'email-accounts' },
  { id: 'email-encryption', name: 'Encryption (GnuPG)', description: 'Create and manage public and private GnuPG encryption keys.', category: 'email', iconName: 'KeyRound', appTarget: 'email-accounts' },

  // Files
  { id: 'file-manager', name: 'File Manager', description: 'Navigate, upload, edit, compress, and chmod files in your home directory.', category: 'files', iconName: 'FolderTree', appTarget: 'file-manager', badge: 'Core' },
  { id: 'images-tool', name: 'Images', description: 'View, resize, thumbnail, and convert images hosted on your account.', category: 'files', iconName: 'Image', appTarget: 'file-manager' },
  { id: 'directory-privacy', name: 'Directory Privacy', description: 'Password-protect directories using .htaccess authentication.', category: 'files', iconName: 'FolderLock', appTarget: 'file-manager' },
  { id: 'disk-usage', name: 'Disk Usage', description: 'View visual tree breakdown of disk utilization across directories.', category: 'files', iconName: 'PieChart', appTarget: 'metrics' },
  { id: 'ftp-accounts', name: 'FTP Accounts', description: 'Create and configure FTP credentials, homedirs, and bandwidth caps.', category: 'files', iconName: 'Server', appTarget: 'file-manager' },
  { id: 'backup-wizard', name: 'Backup Wizard', description: 'Generate full cPanel tar.gz archives or restore home directories.', category: 'files', iconName: 'DownloadCloud', appTarget: 'file-manager' },
  { id: 'git-version-control', name: 'Git™ Version Control', description: 'Clone, host, and push repositories for continuous deployment.', category: 'files', iconName: 'GitFork', appTarget: 'terminal' },

  // Databases
  { id: 'phpmyadmin', name: 'phpMyAdmin', description: 'Access the web GUI for MySQL database schema, records, and SQL queries.', category: 'databases', iconName: 'Database', appTarget: 'phpmyadmin', badge: 'Essential' },
  { id: 'mysql-databases', name: 'MySQL® Databases', description: 'Create databases, manage database users, and grant table privileges.', category: 'databases', iconName: 'Layers', appTarget: 'mysql' },
  { id: 'mysql-wizard', name: 'MySQL® Database Wizard', description: 'Step-by-step wizard to create a database, user, and assign privileges.', category: 'databases', iconName: 'Wand2', appTarget: 'mysql' },
  { id: 'remote-mysql', name: 'Remote MySQL®', description: 'Whitelist external IP addresses to connect directly to MySQL port 3306.', category: 'databases', iconName: 'Globe2', appTarget: 'mysql' },

  // Domains
  { id: 'zone-editor', name: 'Zone Editor (DNS)', description: 'Add, edit, and delete A, AAAA, CNAME, MX, and TXT (SPF/DKIM) records.', category: 'domains', iconName: 'Network', appTarget: 'zone-editor', badge: 'Popular' },
  { id: 'domains-mgmt', name: 'Domains', description: 'View and manage all primary, addon, and parked domains.', category: 'domains', iconName: 'Globe', appTarget: 'zone-editor' },
  { id: 'subdomains', name: 'Subdomains', description: 'Create subdomain prefixes like dev., api., or blog. to custom directories.', category: 'domains', iconName: 'Share2', appTarget: 'zone-editor' },
  { id: 'aliases', name: 'Aliases (Parked Domains)', description: 'Point other domain names to show the exact same website content.', category: 'domains', iconName: 'Copy', appTarget: 'zone-editor' },
  { id: 'redirects', name: 'Redirects', description: 'Set up 301 Permanent or 302 Temporary redirects for specific URLs.', category: 'domains', iconName: 'ArrowRightLeft', appTarget: 'zone-editor' },

  // Metrics
  { id: 'visitors', name: 'Visitors', description: 'Inspect real-time HTTP server hits with IP, user-agent, and status codes.', category: 'metrics', iconName: 'Users', appTarget: 'metrics' },
  { id: 'errors', name: 'Errors', description: 'Review the latest 300 entries from the Apache error_log for debugging.', category: 'metrics', iconName: 'AlertTriangle', appTarget: 'metrics' },
  { id: 'bandwidth', name: 'Bandwidth', description: 'View bandwidth consumption trends by HTTP, POP3, IMAP, and FTP protocols.', category: 'metrics', iconName: 'Activity', appTarget: 'metrics' },
  { id: 'raw-access', name: 'Raw Access', description: 'Download archived access logs in gzip format for log analytics.', category: 'metrics', iconName: 'FileText', appTarget: 'metrics' },
  { id: 'resource-usage', name: 'Resource Usage', description: 'Inspect CloudLinux CPU, physical memory, IOPS, and entry processes.', category: 'metrics', iconName: 'Gauge', appTarget: 'metrics', badge: 'Live' },

  // Security
  { id: 'ssl-tls', name: 'SSL/TLS Status', description: 'Review domain certificates, run cPanel AutoSSL, and install custom certs.', category: 'security', iconName: 'ShieldCheck', appTarget: 'ssl-tls', badge: 'Active' },
  { id: 'ssh-access', name: 'SSH Access', description: 'Manage SSH public/private keys and authorized_keys for shell logins.', category: 'security', iconName: 'Terminal', appTarget: 'terminal' },
  { id: 'ip-blocker', name: 'IP Blocker', description: 'Prevent specific IP addresses or CIDR blocks from reaching your sites.', category: 'security', iconName: 'Ban', appTarget: 'ssl-tls' },
  { id: 'hotlink-protection', name: 'Hotlink Protection', description: 'Prevent third-party websites from directly embedding your images.', category: 'security', iconName: 'Link2Off', appTarget: 'ssl-tls' },
  { id: 'two-factor-auth', name: 'Two-Factor Authentication', description: 'Enforce Google Authenticator / TOTP for cPanel logins.', category: 'security', iconName: 'Smartphone', appTarget: 'ssl-tls' },

  // Software
  { id: 'wordpress-toolkit', name: 'WordPress Toolkit', description: '1-click staging, automated updates, security check, and WP Admin SSO.', category: 'software', iconName: 'Box', appTarget: 'wordpress', badge: 'Featured' },
  { id: 'php-selector', name: 'Select PHP Version', description: 'Switch between PHP 7.4 through 8.3 and toggle extensions like OPcache.', category: 'software', iconName: 'Cpu', appTarget: 'php-selector' },
  { id: 'php-ini-editor', name: 'MultiPHP INI Editor', description: 'Edit memory_limit, upload_max_filesize, max_execution_time directives.', category: 'software', iconName: 'FileCode', appTarget: 'php-selector' },
  { id: 'optimize-website', name: 'Optimize Website', description: 'Configure mod_deflate gzip compression for all outgoing text/html assets.', category: 'software', iconName: 'Zap', appTarget: 'php-selector' },

  // Advanced
  { id: 'terminal', name: 'Terminal', description: 'Direct in-browser command-line SSH session to manage server files and tools.', category: 'advanced', iconName: 'TerminalSquare', appTarget: 'terminal', badge: 'CLI' },
  { id: 'cron-jobs', name: 'Cron Jobs', description: 'Schedule recurring Linux bash or PHP commands at automated intervals.', category: 'advanced', iconName: 'Clock', appTarget: 'cron-jobs' },
  { id: 'track-dns', name: 'Track DNS', description: 'Trace DNS lookups and verify MX records across authoritative nameservers.', category: 'advanced', iconName: 'Crosshair', appTarget: 'zone-editor' },
  { id: 'error-pages', name: 'Error Pages', description: 'Create custom branded templates for 400, 401, 403, 404, and 500 responses.', category: 'advanced', iconName: 'FileQuestion', appTarget: 'file-manager' },

  // Preferences
  { id: 'password-security', name: 'Password & Security', description: 'Update your cPanel login password with entropy calculation.', category: 'preferences', iconName: 'Lock', appTarget: 'dashboard' },
  { id: 'change-language', name: 'Change Language', description: 'Set cPanel interface localization across 30 supported languages.', category: 'preferences', iconName: 'Languages', appTarget: 'dashboard' },
  { id: 'change-style', name: 'Change Style', description: 'Switch cPanel theme between Jupiter Light, Dark, and High Contrast.', category: 'preferences', iconName: 'Palette', appTarget: 'dashboard' },
  { id: 'user-manager', name: 'User Manager', description: 'Manage collaborative user access to FTP, Webmail, and cPanel consoles.', category: 'preferences', iconName: 'UserCheck', appTarget: 'dashboard' },
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'f1',
    name: 'public_html',
    path: '/home/demouser',
    type: 'directory',
    size: 4096,
    modified: '2026-10-02 08:30:15',
    permissions: '0755',
  },
  {
    id: 'f2',
    name: 'mail',
    path: '/home/demouser',
    type: 'directory',
    size: 4096,
    modified: '2026-10-01 19:12:00',
    permissions: '0750',
  },
  {
    id: 'f3',
    name: 'ssl',
    path: '/home/demouser',
    type: 'directory',
    size: 4096,
    modified: '2026-09-28 14:02:44',
    permissions: '0700',
  },
  {
    id: 'f4',
    name: 'etc',
    path: '/home/demouser',
    type: 'directory',
    size: 4096,
    modified: '2026-09-20 11:45:21',
    permissions: '0750',
  },
  {
    id: 'f5',
    name: 'tmp',
    path: '/home/demouser',
    type: 'directory',
    size: 4096,
    modified: '2026-10-02 09:00:00',
    permissions: '0777',
  },
  {
    id: 'f6',
    name: '.bashrc',
    path: '/home/demouser',
    type: 'file',
    size: 3771,
    modified: '2026-09-15 10:14:00',
    permissions: '0644',
    extension: 'bashrc',
    content: `# .bashrc\n# Source global definitions\nif [ -f /etc/bashrc ]; then\n\t. /etc/bashrc\nfi\n\n# User specific aliases and functions\nalias ll='ls -la'\nalias cpanel='echo "cPanel VPS environment v120.0"'\nexport PATH=$PATH:$HOME/bin\n`
  },
  // inside public_html
  {
    id: 'f7',
    name: 'index.php',
    path: '/home/demouser/public_html',
    type: 'file',
    size: 1420,
    modified: '2026-10-01 16:45:20',
    permissions: '0644',
    extension: 'php',
    content: `<?php\n/**\n * Front to the WordPress application.\n * This file doesn't do anything, but loads wp-blog-header.php which does and tells WordPress to load the theme.\n */\n\ndefine( 'WP_USE_THEMES', true );\n\n/** Loads the WordPress Environment and Template */\nrequire __DIR__ . '/wp-blog-header.php';\n`
  },
  {
    id: 'f8',
    name: 'wp-config.php',
    path: '/home/demouser/public_html',
    type: 'file',
    size: 3120,
    modified: '2026-09-30 11:20:10',
    permissions: '0600',
    extension: 'php',
    content: `<?php\n// ** MySQL settings - You can get this info from your web host ** //\ndefine( 'DB_NAME', 'demouser_wp' );\ndefine( 'DB_USER', 'demouser_admin' );\ndefine( 'DB_PASSWORD', 'K9#vX$82mP!qL@' );\ndefine( 'DB_HOST', 'localhost' );\ndefine( 'DB_CHARSET', 'utf8mb4' );\ndefine( 'DB_COLLATE', '' );\n\n$table_prefix = 'wp_';\n\ndefine( 'WP_DEBUG', false );\n\n/* That's all, stop editing! Happy publishing. */\nif ( ! defined( 'ABSPATH' ) ) {\n\tdefine( 'ABSPATH', __DIR__ . '/' );\n}\nrequire_once ABSPATH . 'wp-settings.php';\n`
  },
  {
    id: 'f9',
    name: '.htaccess',
    path: '/home/demouser/public_html',
    type: 'file',
    size: 245,
    modified: '2026-09-29 09:15:33',
    permissions: '0644',
    extension: 'htaccess',
    content: `# BEGIN WordPress\n<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteBase /\nRewriteRule ^index\\.php$ - [L]\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule . /index.php [L]\n</IfModule>\n# END WordPress\n`
  },
  {
    id: 'f10',
    name: 'wp-content',
    path: '/home/demouser/public_html',
    type: 'directory',
    size: 4096,
    modified: '2026-10-02 07:15:00',
    permissions: '0755',
  },
  {
    id: 'f11',
    name: 'robots.txt',
    path: '/home/demouser/public_html',
    type: 'file',
    size: 89,
    modified: '2026-09-20 12:00:00',
    permissions: '0644',
    extension: 'txt',
    content: `User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\nSitemap: https://example-corp.com/sitemap.xml\n`
  }
];

export const INITIAL_EMAILS: EmailAccount[] = [
  { id: 'm1', address: 'admin@example-corp.com', domain: 'example-corp.com', usageMb: 420.5, quotaMb: 2048, created: '2026-01-15', hasAutoresponder: false },
  { id: 'm2', address: 'support@example-corp.com', domain: 'example-corp.com', usageMb: 1120.0, quotaMb: 5120, created: '2026-02-01', hasAutoresponder: true },
  { id: 'm3', address: 'billing@example-corp.com', domain: 'example-corp.com', usageMb: 180.2, quotaMb: 1024, created: '2026-03-10', hasAutoresponder: false },
  { id: 'm4', address: 'info@example-corp.com', domain: 'example-corp.com', usageMb: 95.8, quotaMb: 1024, created: '2026-04-05', hasAutoresponder: true },
];

export const INITIAL_DNS_RECORDS: DnsRecord[] = [
  { id: 'd1', name: 'example-corp.com.', ttl: 14400, type: 'A', record: '198.51.100.42' },
  { id: 'd2', name: 'www.example-corp.com.', ttl: 14400, type: 'CNAME', record: 'example-corp.com.' },
  { id: 'd3', name: 'mail.example-corp.com.', ttl: 14400, type: 'A', record: '198.51.100.42' },
  { id: 'd4', name: 'example-corp.com.', ttl: 14400, type: 'MX', record: 'mail.example-corp.com.', priority: 10 },
  { id: 'd5', name: 'example-corp.com.', ttl: 14400, type: 'TXT', record: '"v=spf1 +a +mx +ip4:198.51.100.42 ~all"' },
  { id: 'd6', name: 'default._domainkey.example-corp.com.', ttl: 14400, type: 'TXT', record: '"v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyq7g9L..."' },
  { id: 'd7', name: 'staging.example-corp.com.', ttl: 14400, type: 'A', record: '198.51.100.42' },
  { id: 'd8', name: 'api.example-corp.com.', ttl: 14400, type: 'A', record: '198.51.100.42' },
];

export const INITIAL_DATABASES: DatabaseRecord[] = [
  { name: 'demouser_wp', sizeMb: 145.8, users: ['demouser_admin'], tablesCount: 28 },
  { name: 'demouser_shop', sizeMb: 124.2, users: ['demouser_admin', 'demouser_shopusr'], tablesCount: 42 },
  { name: 'demouser_analytics', sizeMb: 42.4, users: ['demouser_admin'], tablesCount: 12 },
];

export const INITIAL_WP_SITES: WordPressSite[] = [
  {
    id: 'wp1',
    title: 'Example Corp Corporate Portal',
    url: 'https://example-corp.com',
    path: '/home/demouser/public_html',
    version: '6.6.2',
    phpVersion: '8.2',
    sslActive: true,
    autoUpdate: true,
    maintenanceMode: false,
    adminEmail: 'admin@example-corp.com',
    pluginsCount: 14,
    pluginsUpdateAvailable: 2,
  },
  {
    id: 'wp2',
    title: 'Staging Environment',
    url: 'https://staging.example-corp.com',
    path: '/home/demouser/staging',
    version: '6.6.2',
    phpVersion: '8.2',
    sslActive: true,
    autoUpdate: false,
    maintenanceMode: false,
    adminEmail: 'dev@example-corp.com',
    pluginsCount: 14,
    pluginsUpdateAvailable: 0,
  }
];

export const INITIAL_CRON_JOBS: CronJob[] = [
  {
    id: 'cron1',
    minute: '0',
    hour: '2',
    day: '*',
    month: '*',
    weekday: '*',
    command: '/usr/local/bin/php /home/demouser/public_html/wp-cron.php >/dev/null 2>&1',
    description: 'Daily WordPress maintenance and scheduled posts publish queue',
    active: true,
  },
  {
    id: 'cron2',
    minute: '*/15',
    hour: '*',
    day: '*',
    month: '*',
    weekday: '*',
    command: '/usr/bin/python3 /home/demouser/scripts/sync_inventory.py',
    description: 'Sync e-commerce catalog stock levels every 15 minutes',
    active: true,
  },
  {
    id: 'cron3',
    minute: '30',
    hour: '3',
    day: '*',
    month: '*',
    weekday: '0',
    command: '/home/demouser/bin/backup_mysqldump.sh',
    description: 'Weekly Sunday database dump snapshot archive',
    active: true,
  }
];

export const INITIAL_LOGS: VisitorLog[] = [
  { id: 'l1', ip: '66.249.66.12', timestamp: '02/Oct/2026:10:28:44 -0700', method: 'GET', url: '/', status: 200, bytes: 24890, userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)' },
  { id: 'l2', ip: '157.55.39.81', timestamp: '02/Oct/2026:10:27:12 -0700', method: 'GET', url: '/pricing', status: 200, bytes: 18450, userAgent: 'Mozilla/5.0 (compatible; bingbot/2.0)' },
  { id: 'l3', ip: '192.0.2.77', timestamp: '02/Oct/2026:10:26:01 -0700', method: 'POST', url: '/wp-login.php', status: 302, bytes: 1420, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
  { id: 'l4', ip: '198.51.100.99', timestamp: '02/Oct/2026:10:24:19 -0700', method: 'GET', url: '/api/v1/status', status: 200, bytes: 480, userAgent: 'curl/7.88.1' },
  { id: 'l5', ip: '203.0.113.50', timestamp: '02/Oct/2026:10:22:30 -0700', method: 'GET', url: '/old-assets/style.css', status: 404, bytes: 1024, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  { id: 'l6', ip: '198.51.100.12', timestamp: '02/Oct/2026:10:20:55 -0700', method: 'GET', url: '/contact-us', status: 200, bytes: 15300, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)' },
  { id: 'l7', ip: '142.250.190.46', timestamp: '02/Oct/2026:10:18:11 -0700', method: 'GET', url: '/robots.txt', status: 200, bytes: 89, userAgent: 'Googlebot-Image/1.0' },
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'n1',
    title: 'AutoSSL Certificate Renewed',
    message: 'Let\'s Encrypt AutoSSL successfully renewed SSL certificates for example-corp.com and 4 subdomains.',
    time: '1 hour ago',
    type: 'success',
    read: false,
  },
  {
    id: 'n2',
    title: 'PHP 8.2 Default Runtime Active',
    message: 'PHP 8.2.14 is active with OPcache enabled. JIT compiler operating normally.',
    time: '5 hours ago',
    type: 'info',
    read: false,
  },
  {
    id: 'n3',
    title: 'Weekly cPanel Backup Scheduled',
    message: 'Full server home directory backup scheduled for Sunday at 03:00 UTC.',
    time: 'Yesterday',
    type: 'info',
    read: true,
  },
];
