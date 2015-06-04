(function (window, skate) {
    'use strict';

    var KEYCODE_ENTER = 13;
    var slice = Array.prototype.slice;

    skate('todo-app', {
        events: {
            'clear': function (elem, e, target) {
                console.log(e.type);
            },
            'create': function (elem, e, target) {
                console.log(e.type);
            },
            'destroy': function (elem, e, target) {
                console.log(e.type);
            },
            'filter': function (elem, e, target) {
                console.log(e.type);
            },
            'toggle': function (elem, e, target) {
                console.log(e.type);
            }
        },
        template: function (elem) {
            elem.innerHTML = `
				<section class="todoapp">
					<header class="header">
						<h1>todos</h1>
						<input is="todo-input">
					</header>

					<!-- This section should be hidden by default and shown when there are todos -->
					<section class="main">
					    <todo-toggle></todo-toggle>
						<ul class="todo-list"></ul>
					</section>

					<!-- This footer should hidden by default and shown when there are todos -->
					<todo-footer></todo-footer>

				</section>
			`;
        }
    });

    skate('todo-input', {
        extends: 'input',
        events: {
            keyup: function (elem, e, target) {
                if (e.keyCode === KEYCODE_ENTER) {
                    var value = (elem.value || '').trim();

                    if (!value) {
                        return;
                    }

                    elem.dispatchEvent(new CustomEvent('create', {
                        bubbles: true,
                        detail: value
                    }));

                    elem.value = '';
                }
            }
        },
        created: function (elem) {
            elem.classList.add('new-todo');
            elem.setAttribute('placeholder', 'What needs to be done?');
            elem.setAttribute('autofocus', '');
        }
    });

    skate('todo-toggle', {
        events: {
            'change input[type="checkbox"]': function (elem, e, target) {
                elem.dispatchEvent(new CustomEvent('toggle', {
                    bubbles: true,
                    detail: !!elem.checked
                }));
            }
        },
        template: function (elem) {
            elem.innerHTML = `
                <input class="toggle-all" type="checkbox">
                <label for="toggle-all">Mark all as complete</label>
			`;
        }
    });

    skate('todo-footer', {
        events: {
            'click .filters a': function (elem, e, target) {
                elem.dispatchEvent(new CustomEvent('filter', {
                    bubbles: true,
                    detail: (target.href || '').split('#/')[1]
                }));

            },
            'click .clear-completed': function (elem, e, target) {
                elem.dispatchEvent(new CustomEvent('clear', {
                    bubbles: true
                }));
            }
        },
        template: function (element) {
            element.innerHTML = `
            <footer class="footer">
                <!-- This should be "0 items left" by default -->
                <span class="todo-count"><strong>0</strong> item left</span>

                <!-- Remove this if you don't implement routing -->
                <ul class="filters">
                    <li>
                        <a class="selected" href="#/">All</a>
                    </li>
                    <li>
                        <a href="#/active">Active</a>
                    </li>
                    <li>
                        <a href="#/completed">Completed</a>
                    </li>
                </ul>

                <!-- Hidden if no completed items are left ↓ -->
                <button class="clear-completed">Clear completed</button>
            </footer>`;
        }
    });


    skate('todo-list', {
        extends: 'ul',
        events: {
            destroy: function (elem, e) {
                elem.removeChild(e.target);
            }
        },
        prototype: {
            get complete () {
                return slice
                    .call(this.children)
                    .filter(function (todo) {
                        return todo.completed;
                    });
            },

            get incomplete () {
                return slice
                    .call(this.children)
                    .filter(function (todo) {
                        return !todo.completed;
                    });
            }
        }
    });

    skate('todo-item', {
        extends: 'li',
        attributes: {
            completed: {
                created: function (elem) {
                    elem.classList.add('completed');
                    elem.querySelector('input[type="checkbox"]').checked = true;
                    elem.dispatchEvent(new CustomEvent('completed', {
                        bubbles: true,
                        detail: true
                    }));
                },
                removed: function (elem) {
                    elem.classList.remove('completed');
                    elem.querySelector('input[type="checkbox"]').checked = false;
                    elem.dispatchEvent(new CustomEvent('completed', {
                        bubbles: true,
                        detail: false
                    }));
                }
            },
            editing: {
                created: function (elem) {
                    elem.classList.add('editing');
                },
                removed: function (elem) {
                    elem.classList.remove('editing');
                }
            },
            text: function (elem, diff) {
                elem.querySelector('label').textContent = diff.newValue.trim();
            }
        },
        events: {
            'change .toggle': function (elem, e, target) {
                elem.completed = target.checked ? true : undefined;
            },
            'click .destroy': function (elem) {
                elem.dispatchEvent(new CustomEvent('destroy', {bubbles: true}));
            },
            'dblclick label': function (elem) {
                elem.querySelector('.edit').value = elem.text;
                elem.classList.add('editing');
            },
            'blur .edit': function (elem, e, target) {
                elem.text = target.value;
                elem.classList.remove('editing');
            },
            'keyup .edit': function (elem, e, target) {
                if (e.keyCode === KEYCODE_ENTER) {
                    elem.text = target.value;
                    elem.classList.remove('editing');
                }
            }
        },
        template: function (elem) {
            elem.innerHTML = `
				<div class="view">
					<input class="toggle" type="checkbox">
					<label>Taste JavaScript</label>
					<button class="destroy"></button>
				</div>
				<input class="edit" value="Create a TodoMVC template">
			`;
        }
    });

})(window, window.skate);
