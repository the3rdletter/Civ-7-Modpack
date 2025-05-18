import { createRoot } from 'react-dom/client'
import modConfig from './mod.config.js'
import { MustGetElement } from '/core/ui/utilities/utilities-dom.js'

class ReactDecorator<T extends Component> implements ComponentDecorator {
    readonly Root: ComponentRoot<Component>
    private container: HTMLElement | null = null

    constructor(
        public readonly component: T,
        public readonly jsxComponent: React.ReactElement,
        private insertPosition: InsertPosition,
        private rootSelector?: string
    ) {
        this.Root = this.component.Root as unknown as ComponentRoot<Component>
    }

    beforeAttach() {}

    afterAttach() {
        let attachmentRoot = this.Root
        try {
            attachmentRoot = MustGetElement(
                this.rootSelector,
                this.Root as HTMLElement
            )
        } catch (e) {}

        if (attachmentRoot) {
            this.container = document.createElement('div')
            this.container.classList.add(modConfig.id)

            attachmentRoot.insertAdjacentElement(
                this.insertPosition,
                this.container
            )
            const root = createRoot(this.container)
            root.render(this.jsxComponent)
        }
    }

    beforeDetach() {
        if (!this.container) return

        this.container.remove()
        this.container = null
    }

    afterDetach() {}

    onAttributeChanged(name: string, prev: string, next: string) {}
}

export function insertReactComponent({
    control,
    component,
    rootSelector,
    insertPosition = 'afterbegin',
}: {
    control: string
    component: React.ReactElement
    rootSelector?: string
    insertPosition?: InsertPosition
}) {
    const decorator = Controls.decorate(
        control,
        (decoratedComponent: Component) =>
            new ReactDecorator(
                decoratedComponent,
                component,
                insertPosition,
                rootSelector
            )
    )

    return decorator
}
