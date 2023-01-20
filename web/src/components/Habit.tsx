interface HabitProps {
    completed: number;
}

const Habit = (props: HabitProps) => {
    return (
        <p className="bg-zinc-900 w-40 text-white">How much do you complete your habits? {props.completed}</p>
    )
}

export default Habit;