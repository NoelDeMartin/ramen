import { showLoading, hideLoading } from '@/components/AppLoader.vue';

type Operation<P extends unknown[]> = (...params: P) => unknown;

function getFocusedElement(): HTMLElement | null {
    const activeElement = document.activeElement;

    return activeElement && 'blur' in activeElement ? activeElement : null;
}

export function safe<P extends unknown[]>(operation: Operation<P>): Operation<P>;
export function safe<P extends unknown[]>(message: string, operation: Operation<P>): Operation<P>;
export function safe<P extends unknown[]>(
    messageOrOperation: string | Operation<P>,
    operationOrNothing?: Operation<P>,
): Operation<P> {
    return async (...args) => {
        const message = typeof messageOrOperation === 'string' ? messageOrOperation : 'Loading...';
        const operation = operationOrNothing ?? messageOrOperation as Operation<P>;

        getFocusedElement()?.blur();
        showLoading(message);

        try {
            const result = await operation(...args);

            return result;
        } catch (error) {
            console.error(error);

            alert(`Error: ${error.message}`);
        } finally {
            hideLoading();
        }
    };
}
