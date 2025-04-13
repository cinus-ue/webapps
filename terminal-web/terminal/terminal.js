class Terminal {
    constructor(options) {
        this.options = options || {};
        this.history = [];
        this.historyIndex = -1;
        this.backgroundColor = this.options.backgroundColor || '#1e1e1e';

        this.element = document.createElement('div');
        this.element.className = 'terminal-container';
        this.element.style.backgroundColor = this.backgroundColor;

        this.output = document.createElement('div');
        this.output.className = 'terminal-output';
        this.element.appendChild(this.output);

        this.commandLine = document.createElement('div');
        this.commandLine.className = 'command-line';

        this.prompt = document.createElement('span');
        this.prompt.className = 'prompt';
        this.prompt.textContent = '$ ';
        this.commandLine.appendChild(this.prompt);

        this.input = document.createElement('input');
        this.input.className = 'command-input';
        this.input.type = 'text';
        this.input.placeholder = this.options.placeholder || '';
        this.commandLine.appendChild(this.input);

        this.element.appendChild(this.commandLine);

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand(this.input.value);
            } else if (e.key === 'ArrowUp') {
                this.navigateHistory(1);
            } else if (e.key === 'ArrowDown') {
                this.navigateHistory(-1);
            }
        });
    }

    setBackgroundColor(color) {
        this.backgroundColor = color;
        this.element.style.backgroundColor = color;
    }

    executeCommand(command) {
        if (command.trim() === '') return;

        this.history.unshift(command);
        this.historyIndex = -1;

        this.logHTML(`<span class="prompt">$</span> ${command}`);

        if (this.options.handleCommand) {
            this.options.handleCommand(command);
        }

        this.input.value = '';
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return;

        this.historyIndex = Math.max(-1,
            Math.min(this.history.length - 1, this.historyIndex + direction));

        if (this.historyIndex === -1) {
            this.input.value = '';
        } else {
            this.input.value = this.history[this.historyIndex];
        }
    }

    log(message) {
        const output = document.createElement('div');
        output.className = 'output';
        output.textContent = message;
        this.output.appendChild(output);
        return output;
    }

    logHTML(html) {
        const output = document.createElement('div');
        output.className = 'output';
        output.innerHTML = html;
        this.output.appendChild(output);
        return output;
    }

    error(message) {
        const output = document.createElement('div');
        output.className = 'output error';
        output.textContent = message;
        this.output.appendChild(output);
        return output;
    }

    clear() {
        this.output.innerHTML = '';
    }
}
