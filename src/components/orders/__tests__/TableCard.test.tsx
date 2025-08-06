import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TableCard from '../TableCard';

vi.mock('@/stores/booths/tableDetail', () => ({
  useTableDetail: () => ({
    getCustomTableNum: (num: number) => num,
  }),
}));

vi.mock('@/stores/orders/tableVisualization', () => ({
  useTableVisualizationDetail: () => ({
    openTableVisualDetail: vi.fn(),
  }),
}));

describe('TableCard', () => {
  const base = { tableNumIndex: 1 };

  it('renders ready table with correct label and style', () => {
    const table = { ...base, type: 'ready', orderInfo: { totalPrice: 1000 } as any };
    render(<TableCard table={table} />);
    const status = screen.getByText('입금대기');
    expect(status.className).toContain('text-danger-800');
    const container = status.parentElement?.parentElement as HTMLElement;
    expect(container.className).toContain('bg-danger-50');
  });

  it('renders cooking table with correct label and style', () => {
    const table = { ...base, type: 'cooking', orderInfo: { totalPrice: 1000 } as any };
    render(<TableCard table={table} />);
    const status = screen.getByText('조리중');
    expect(status.className).toContain('text-primary-800');
    const container = status.parentElement?.parentElement as HTMLElement;
    expect(container.className).toContain('bg-primary-300');
  });

  it('renders complete table with correct label and style', () => {
    const table = { ...base, type: 'complete', orderInfo: { totalPrice: 1000 } as any };
    render(<TableCard table={table} />);
    const status = screen.getByText('조리완료');
    expect(status.className).toContain('text-success-900');
    const container = status.parentElement?.parentElement as HTMLElement;
    expect(container.className).toContain('bg-success-50');
  });

  it('renders table with no order info', () => {
    const table = { ...base, type: 'complete', orderInfo: null };
    render(<TableCard table={table} />);
    const status = screen.getByText('주문 건 없음');
    expect(status.className).toContain('text-secondary-600');
    const container = status.parentElement?.parentElement as HTMLElement;
    expect(container.className).toContain('bg-gray-200');
  });
});
