import { LoggerColors, LoggerConfigImpl, LoggerGroupsMethods, LoggerLabels, LoggerMethods } from './logger.interfaces';

export enum FormatLine {
    STRING = '%s',
    NUMBER = '%d',
    OBJECT = '%O',
    DOM = '%o'
}

export enum LABELS {
    TRACE = '[TRACE]:',
    DEBUG = '[DEBUG]:',
    INFO = '[INFO]:',
    WARN = '[WARN]:',
    ERROR = '[ERROR]:'
}

export enum COLORS {
    TRACE = '#000080',
    DEBUG = '#00BFFE',
    INFO = '#000000',
    WARN = '#FF6419',
    ERROR = '#F1062D'
}

export enum LoggerGroupType {
    OPENED = 'group',
    CLOSED = 'groupCollapsed'
}

export enum LoggerLevel {
    ALL = 1,
    TRACE,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    OFF
}

export const DEFAULT_LABELS: LoggerLabels = {
    [LoggerLevel.TRACE]: LABELS.TRACE,
    [LoggerLevel.DEBUG]: LABELS.DEBUG,
    [LoggerLevel.INFO]: LABELS.INFO,
    [LoggerLevel.WARN]: LABELS.WARN,
    [LoggerLevel.ERROR]: LABELS.ERROR
};

export const DEFAULT_COLORS: LoggerColors = {
    [LoggerLevel.TRACE]: COLORS.TRACE,
    [LoggerLevel.DEBUG]: COLORS.DEBUG,
    [LoggerLevel.INFO]: COLORS.INFO,
    [LoggerLevel.WARN]: COLORS.WARN,
    [LoggerLevel.ERROR]: COLORS.ERROR
};

export const DEFAULT_METHODS: LoggerMethods = {
    [LoggerLevel.TRACE]: 'debug',
    [LoggerLevel.DEBUG]: 'info',
    [LoggerLevel.INFO]: 'info',
    [LoggerLevel.WARN]: 'warn',
    [LoggerLevel.ERROR]: 'error'
};

export const DEFAULT_GROUPS_CONFIG: LoggerGroupsMethods = {
    [LoggerGroupType.OPENED]: {
        label: '',
        level: LoggerLevel.INFO,
        type: LoggerGroupType.OPENED
    },
    [LoggerGroupType.CLOSED]: {
        label: '',
        level: LoggerLevel.INFO,
        type: LoggerGroupType.CLOSED
    }
};

export const config: LoggerConfigImpl = {
    minLevel: LoggerLevel.ALL,
    consoleInstance: { ...{}, ...(console || {}) } as Console,
    configLabel: DEFAULT_LABELS,
    configColor: DEFAULT_COLORS,
    configMethods: DEFAULT_METHODS,
    configGroups: DEFAULT_GROUPS_CONFIG,
    noop: () => {},
    labelUpperCase: true,
    lineStyle: {
        style: null,
        format: FormatLine.STRING
    }
};
