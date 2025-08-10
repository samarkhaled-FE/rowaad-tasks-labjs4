// Task management system
class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        this.currentFilter = 'all';
        this.taskIdCounter = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
        
        this.initializeElements();
        this.setupEventListeners();
        this.render();
    }
    
    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
    }
    
    setupEventListeners() {
        // Add task
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        // Input validation
        this.taskInput.addEventListener('input', () => this.validateInput());
        
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
        
        // Clear buttons
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
        
        // Task list delegation
        this.taskList.addEventListener('click', (e) => this.handleTaskClick(e));
        this.taskList.addEventListener('change', (e) => this.handleTaskChange(e));
        this.taskList.addEventListener('keypress', (e) => this.handleTaskKeypress(e));
    }
    
    validateInput() {
        const value = this.taskInput.value.trim();
        this.addBtn.disabled = value.length === 0;
    }
    
    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;
        
        const task = {
            id: this.taskIdCounter++,
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.unshift(task); // Add to beginning
        this.taskInput.value = '';
        this.addBtn.disabled = true;
        
        this.saveToStorage();
        this.render();
        
        // Show success feedback
        this.showFeedback('Task added successfully!', 'success');
    }
    
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            
            this.saveToStorage();
            this.render();
            
            const message = task.completed ? 'Task completed!' : 'Task marked as active!';
            this.showFeedback(message, 'success');
        }
    }
    
    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveToStorage();
            this.render();
            this.showFeedback('Task deleted!', 'info');
        }
    }
    
    editTask(id) {
        const taskElement = document.querySelector(`[data-task-id="${id}"]`);
        const textElement = taskElement.querySelector('.task-text');
        const actionsElement = taskElement.querySelector('.task-actions');
        
        const currentText = textElement.textContent;
        
        // Create edit input
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.value = currentText;
        editInput.maxLength = 100;
        
        // Create save and cancel buttons
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.textContent = 'Save';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = 'Cancel';
        
        // Replace content
        taskElement.classList.add('editing');
        textElement.style.display = 'none';
        actionsElement.innerHTML = '';
        
        taskElement.insertBefore(editInput, actionsElement);
        actionsElement.appendChild(saveBtn);
        actionsElement.appendChild(cancelBtn);
        
        editInput.focus();
        editInput.select();
        
        // Save function
        const saveEdit = () => {
            const newText = editInput.value.trim();
            if (newText && newText !== currentText) {
                const task = this.tasks.find(t => t.id === id);
                if (task) {
                    task.text = newText;
                    task.updatedAt = new Date().toISOString();
                    this.saveToStorage();
                    this.showFeedback('Task updated!', 'success');
                }
            }
            this.render();
        };
        
        // Cancel function
        const cancelEdit = () => {
            this.render();
        };
        
        // Event listeners
        saveBtn.addEventListener('click', saveEdit);
        cancelBtn.addEventListener('click', cancelEdit);
        editInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') cancelEdit();
        });
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.render();
    }
    
    clearCompleted() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showFeedback('No completed tasks to clear!', 'info');
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveToStorage();
            this.render();
            this.showFeedback(`${completedCount} completed task(s) deleted!`, 'info');
        }
    }
    
    clearAll() {
        if (this.tasks.length === 0) {
            this.showFeedback('No tasks to clear!', 'info');
            return;
        }
        
        if (confirm(`Are you sure you want to delete all ${this.tasks.length} task(s)?`)) {
            this.tasks = [];
            this.saveToStorage();
            this.render();
            this.showFeedback('All tasks deleted!', 'info');
        }
    }
    
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }
    
    render() {
        const filteredTasks = this.getFilteredTasks();
        
        // Update counters
        this.totalTasks.textContent = this.tasks.length;
        this.completedTasks.textContent = this.tasks.filter(t => t.completed).length;
        
        // Show/hide empty state
        if (filteredTasks.length === 0) {
            this.emptyState.classList.remove('hidden');
            this.taskList.innerHTML = '';
        } else {
            this.emptyState.classList.add('hidden');
            this.renderTasks(filteredTasks);
        }
        
        // Update empty state message based on filter
        const emptyMessages = {
            all: { icon: '📝', title: 'No tasks yet', text: 'Add a task above to get started!' },
            active: { icon: '✅', title: 'No active tasks', text: 'All tasks are completed!' },
            completed: { icon: '🎉', title: 'No completed tasks', text: 'Complete some tasks to see them here!' }
        };
        
        const message = emptyMessages[this.currentFilter];
        this.emptyState.querySelector('.empty-icon').textContent = message.icon;
        this.emptyState.querySelector('h3').textContent = message.title;
        this.emptyState.querySelector('p').textContent = message.text;
    }
    
    renderTasks(tasks) {
        this.taskList.innerHTML = tasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="edit-btn" title="Edit task">✏️</button>
                    <button class="delete-btn" title="Delete task">🗑️</button>
                </div>
            </li>
        `).join('');
    }
    
    handleTaskClick(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        
        const taskId = parseInt(taskItem.dataset.taskId);
        
        if (e.target.classList.contains('delete-btn')) {
            this.deleteTask(taskId);
        } else if (e.target.classList.contains('edit-btn')) {
            this.editTask(taskId);
        }
    }
    
    handleTaskChange(e) {
        if (e.target.classList.contains('task-checkbox')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = parseInt(taskItem.dataset.taskId);
            this.toggleTask(taskId);
        }
    }
    
    handleTaskKeypress(e) {
        if (e.target.classList.contains('edit-input')) {
            if (e.key === 'Enter') {
                e.target.nextElementSibling.querySelector('.save-btn').click();
            } else if (e.key === 'Escape') {
                e.target.nextElementSibling.querySelector('.cancel-btn').click();
            }
        }
    }
    
    saveToStorage() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showFeedback(message, type) {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `feedback ${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'info' ? '#17a2b8' : '#ffc107'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(feedback);
        
        // Remove after 3 seconds
        setTimeout(() => {
            feedback.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
}

// Add CSS animations for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
    console.log('Todo List App initialized!');
});

