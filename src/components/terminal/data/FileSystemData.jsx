// FileSystemData.js - Virtual file system structure - Updated with Propaganda section
export const fileSystem = {
    '/': {
        type: 'directory',
        children: {
            'home': {
                type: 'directory',
                children: {
                    'user': {
                        type: 'directory',
                        children: {
                            'documents': {
                                type: 'directory',
                                children: {
                                    'report.txt': {
                                        type: 'file',
                                        content: 'NuCaloric System Report - Version 3.2.1\n\nSystem Status: Operational\nLast Maintenance: 2025-03-15\nNext Scheduled Check: 2025-04-30\n\nAlert Level: Normal\nSecurity Protocols: Active'
                                    },
                                    'notes.txt': {
                                        type: 'file',
                                        content: 'Remember to check the security logs weekly.\nBackup schedule changed to Tuesdays at 2am.'
                                    }
                                }
                            },
                            'sites': {
                                type: 'directory',
                                children: {
                                    'dashboard': {
                                        type: 'directory',
                                        children: {
                                            'main': { type: 'app', scene: 'main' },
                                            'modern': { type: 'app', scene: 'modernMain' }
                                        }
                                    },
                                    'profile': {
                                        type: 'directory',
                                        children: {
                                            'user': { type: 'app', scene: 'main', tab: 'profile' }
                                        }
                                    },
                                    'directory': {
                                        type: 'app',
                                        scene: 'main',
                                        component: 'siteDirectory'  // This allows direct access to directory
                                    },
                                    'propaganda': {
                                        type: 'app',
                                        scene: 'main',
                                        component: 'propaganda'  // This allows direct access to propaganda
                                    },
                                    'login': { type: 'app', scene: 'login' },
                                    'boot': { type: 'app', scene: 'bootup' }
                                }
                            },
                            'system': {
                                type: 'directory',
                                children: {
                                    'logs': {
                                        type: 'directory',
                                        children: {
                                            'system.log': {
                                                type: 'file',
                                                content: '2025-04-16 08:32:14 INFO: System startup completed\n2025-04-16 08:35:22 INFO: User login: admin\n2025-04-16 09:12:45 WARNING: High CPU usage detected\n2025-04-16 09:15:33 INFO: CPU usage returned to normal\n2025-04-16 10:22:18 INFO: Backup started\n2025-04-16 10:45:02 INFO: Backup completed successfully'
                                            },
                                            'security.log': {
                                                type: 'file',
                                                content: '2025-04-15 23:42:18 WARNING: Failed login attempt: username "root"\n2025-04-16 02:15:33 WARNING: Unusual access pattern detected\n2025-04-16 02:16:45 INFO: Security countermeasures activated\n2025-04-16 02:17:12 INFO: Threat contained\n2025-04-16 08:35:22 INFO: Admin login successful'
                                            }
                                        }
                                    },
                                    'config': {
                                        type: 'directory',
                                        children: {
                                            'network.conf': {
                                                type: 'file',
                                                content: '# Network Configuration\nDNS=192.168.1.1\nGATEWAY=192.168.1.1\nIP_MODE=DHCP\n\n# Security Settings\nFIREWALL=ENABLED\nINTRUSION_DETECTION=ACTIVE\nPORT_SCANNING_PROTECTION=TRUE'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            'bin': {
                type: 'directory',
                children: {
                    'ls': { type: 'system' },
                    'cd': { type: 'system' },
                    'pwd': { type: 'system' },
                    'cat': { type: 'system' },
                    'nano': { type: 'system' },
                    'help': { type: 'system' },
                    'clear': { type: 'system' },
                    'echo': { type: 'system' },
                    'date': { type: 'system' },
                    'whoami': { type: 'system' }
                }
            }
        }
    }
};