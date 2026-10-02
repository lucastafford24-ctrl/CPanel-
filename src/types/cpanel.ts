export type ActiveApp = 
  | 'dashboard'
  | 'file-manager'
  | 'phpmyadmin'
  | 'mysql'
  | 'email-accounts'
  | 'zone-editor'
  | 'terminal'
  | 'wordpress'
  | 'metrics'
  | 'ssl-tls'
  | 'cron-jobs'
  | 'php-selector'
  | 'webmail';

export interface CPanelTool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  iconName: string;
  appTarget?: ActiveApp;
  badge?: string;
  isExternal?: boolean;
}

export type ToolCategory = 
  | 'email'
  | 'files'
  | 'databases'
  | 'domains'
  | 'metrics'
  | 'security'
  | 'software'
  | 'advanced'
  | 'preferences';

export interface CategoryInfo {
  id: ToolCategory;
  title: string;
  description: string;
}

export interface ServerStats {
  currentUser: string;
  primaryDomain: string;
  sharedIp: string;
  homeDir: string;
  lastLogin: string;
  serverName: string;
  cpanelVersion: string;
  apacheVersion: string;
  phpVersion: string;
  mysqlVersion: string;
  architecture: string;
  os: string;
  sendmailPath: string;
  perlPath: string;
  diskUsedGb: number;
  diskTotalGb: number;
  mysqlDiskUsedMb: number;
  bandwidthUsedGb: number;
  bandwidthTotalGb: number;
  emailAccountsCount: number;
  emailAccountsMax: number;
  subdomainsCount: number;
  subdomainsMax: number;
  addonDomainsCount: number;
  addonDomainsMax: number;
  inodesUsed: number;
  inodesMax: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  cpuPercent: number;
  entryProcessesUsed: number;
  entryProcessesMax: number;
  ioUsageKbps: number;
  ioLimitKbps: number;
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number; // in bytes
  modified: string;
  permissions: string;
  extension?: string;
  content?: string;
}

export interface EmailAccount {
  id: string;
  address: string;
  domain: string;
  usageMb: number;
  quotaMb: number; // 0 for unlimited
  created: string;
  hasAutoresponder: boolean;
}

export interface DnsRecord {
  id: string;
  name: string;
  ttl: number;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'SRV';
  record: string;
  priority?: number;
}

export interface DatabaseRecord {
  name: string;
  sizeMb: number;
  users: string[];
  tablesCount: number;
}

export interface DatabaseUser {
  username: string;
  databases: string[];
}

export interface CronJob {
  id: string;
  minute: string;
  hour: string;
  day: string;
  month: string;
  weekday: string;
  command: string;
  description: string;
  active: boolean;
}

export interface WordPressSite {
  id: string;
  title: string;
  url: string;
  path: string;
  version: string;
  phpVersion: string;
  sslActive: boolean;
  autoUpdate: boolean;
  maintenanceMode: boolean;
  adminEmail: string;
  pluginsCount: number;
  pluginsUpdateAvailable: number;
}

export interface VisitorLog {
  id: string;
  ip: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'HEAD';
  url: string;
  status: number;
  bytes: number;
  userAgent: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}
