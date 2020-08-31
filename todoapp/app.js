const { Component, Store } = owl;
const { xml } = owl.tags;
const { whenReady } = owl.utils;
const { useRef, useStore, useDispatch } = owl.hooks;

// -------------------------------------------------------------------------
// Store
// -------------------------------------------------------------------------
const actions = {
  addTask({ state }, title) {
    title = title.trim();
    if (title) {
      const task = {
        id: state.nextId++,
        title: title,
        isCompleted: false,
      };
      state.tasks.push(task);
    }
  },
  toggleTask({ state }, id) {
    const task = state.tasks.find((t) => t.id === id);
    task.isCompleted = !task.isCompleted;
  },
  deleteTask({ state }, id) {
    const index = state.tasks.findIndex((t) => t.id === id);
    state.tasks.splice(index, 1);
  },
};
const initialState = {
  nextId: 1,
  tasks: [],
};

// -------------------------------------------------------------------------
// Task Component
// -------------------------------------------------------------------------
const TASK_TEMPLATE = xml /* xml */`
    <div class="task" t-att-class="props.task.isCompleted ? 'done' : ''">
        <input type="checkbox" t-att-checked="props.task.isCompleted" t-on-click="toggleTask"/>
        <span><t t-esc="props.task.title"/></span>
        <span class="delete" t-on-click="deleteTask">🗑</span>
    </div>`;

class Task extends Component {
    static template = TASK_TEMPLATE;
    static props = ["task"];

    toggleTask() {
    this.trigger('toggle-task', {id: this.props.task.id});
	}

	deleteTask() {
    this.trigger('delete-task', {id: this.props.task.id});
	}

}

// -------------------------------------------------------------------------
// App Component
// -------------------------------------------------------------------------
const APP_TEMPLATE = xml /* xml */`
	<div class="todo-app">
	    <input placeholder="Enter a new task" t-on-keyup="addTask" t-ref="add-input"/>
	    <div class="task-list" t-on-toggle-task="toggleTask" t-on-delete-task="deleteTask">
	    	<span>Hello Owl</span>
	        <t t-foreach="tasks" t-as="task" t-key="task.id">
	            <Task task="task"/>
	        </t>
	    </div>
	</div>
    `;


class App extends Component {
    static template = APP_TEMPLATE;
    static components = { Task };
    inputRef = useRef("add-input");

    nextId = 1;
    tasks = useState([]);

    addTask(ev) {
    // 13 is keycode for ENTER
	    if (ev.keyCode === 13) {
	        const title = ev.target.value.trim();
	        ev.target.value = "";
	        if (title) {
	            const newTask = {
	                id: this.nextId++,
	                title: title,
	                isCompleted: false,
	            };
	            console.log('Here: ',newTask)
	            this.tasks.push(newTask);
	        }
	    }
	}

	mounted() {
	    this.inputRef.el.focus();
	}

	toggleTask(ev) {
    const task = this.tasks.find(t => t.id === ev.detail.id);
    task.isCompleted = !task.isCompleted;
	}

	deleteTask(ev) {
    const index = this.tasks.findIndex(t => t.id === ev.detail.id);
    this.tasks.splice(index, 1);
	}
}   

// -------------------------------------------------------------------------
// Setup code
// -------------------------------------------------------------------------
function setup() {
    owl.config.mode = "dev";
    const app = new App();
    app.mount(document.body);
    console.log('hhhhhhhhhhhhhhhhhhhhh')
}

whenReady(setup);



