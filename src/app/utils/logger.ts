/* eslint-disable */
export class Logger { 
    private context: string; 
    private colors = { 
        reset: "\x1b[0m",
        red: "\x1b[31m", 
        yellow: "\x1b[33m", 
        blue: "\x1b[34m", 
        gray: "\x1b[90m",
        bold: "\x1b[1m", 
    };

    constructor(context: string) {
        this.context = context;
    }

    private formatMessage(level: string, message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const prefix = `${timestamp} ${this.context}:`;
        return { prefix, message, ...(data && { data }) };
    }

    private colorize(color: keyof typeof this.colors, text: string): string {
        return `${this.colors[color]}${text}${this.colors.reset}`;
    }

    private formatLogLevel(level: string): string {
        return `[${level.toUpperCase()}]`;
    }

    private formatOutput({
        prefix,
        message,
        data,
    }: {
        prefix: string;
        message: string;
        data?: any;
    }) {
        const formattedMessage = `${prefix} ${message}`;
        if (data) {
            return `${formattedMessage} ${this.colorize("gray", JSON.stringify(data, null, 2))}`;
        }
        return formattedMessage;
    }

    public info(message: string, data?: any) {
        const formattedMessage = this.formatOutput(this.formatMessage('info', message, data));
        console.log(this.colorize('gray', this.formatLogLevel('info')), formattedMessage);
    }

    public warn(message: string, data?: any) {
        const formattedMessage = this.formatOutput(this.formatMessage('warn', message, data));
        console.warn(this.colorize('gray', this.formatLogLevel('warn')), formattedMessage);
    }

    public error(message: string, data?: any) {
        const formattedMessage = this.formatOutput(this.formatMessage('error', message, data));
        console.error(this.colorize('gray', this.formatLogLevel('error')), formattedMessage);
    }

   
}

export default Logger;