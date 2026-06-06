import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const MotionDiv = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    function MotionDiv(props, ref) {
      return <div ref={ref} {...props} />;
    }
  );
  const MotionButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    function MotionButton(props, ref) {
      return <button ref={ref} {...props} />;
    }
  );
  const MotionSpan = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    function MotionSpan(props, ref) {
      return <span ref={ref} {...props} />;
    }
  );
  return {
    motion: {
      div: MotionDiv,
      button: MotionButton,
      span: MotionSpan,
    },
    useReducedMotion: () => false,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock store
const mockAddEntry = jest.fn();
jest.mock('@/store/useWellnessStore', () => ({
  useWellnessStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      entries: [],
      addEntry: mockAddEntry,
      getTodayEntry: () => null,
      getWeeklyEntries: () => [],
    }),
}));

// Must import after mocks
import MoodCheckIn from '@/components/MoodCheckIn';

describe('MoodCheckIn', () => {
  beforeEach(() => {
    mockAddEntry.mockClear();
  });

  it('renders all 5 mood emoji buttons', () => {
    render(<MoodCheckIn />);
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(5);
  });

  it('renders mood labels for each button', () => {
    render(<MoodCheckIn />);
    expect(
      screen.getByLabelText(/Mood level 1: Hurricane/)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Mood level 5: Clear Skies/)
    ).toBeInTheDocument();
  });

  it('limits note to 200 characters', () => {
    render(<MoodCheckIn />);
    const textarea = screen.getByPlaceholderText(/How are you feeling/);
    expect(textarea).toHaveAttribute('maxLength', '200');
  });

  it('is keyboard navigable via arrow keys and tabs', async () => {
    render(<MoodCheckIn />);
    const user = userEvent.setup();
    const secondRadio = screen.getByLabelText(/Mood level 2/);
    const thirdRadio = screen.getByLabelText(/Mood level 3/);
    
    // Third radio is selected by default, so it should have tabIndex = 0
    expect(thirdRadio).toHaveAttribute('tabIndex', '0');
    expect(secondRadio).toHaveAttribute('tabIndex', '-1');
    
    thirdRadio.focus();
    expect(thirdRadio).toHaveFocus();
    
    // Press ArrowLeft to select and focus the second radio
    await user.keyboard('[ArrowLeft]');
    expect(secondRadio).toHaveAttribute('aria-checked', 'true');
    expect(secondRadio).toHaveFocus();
  });

  it('has a submit button', () => {
    render(<MoodCheckIn />);
    const submitButton = screen.getByRole('button', {
      name: /Log your weather/i,
    });
    expect(submitButton).toBeInTheDocument();
  });
});
