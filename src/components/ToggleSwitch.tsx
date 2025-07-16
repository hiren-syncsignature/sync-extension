interface ToggleSwitchProps {
    label: string;
    description: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
  }
  
  const ToggleSwitch = ({
    label,
    description,
    enabled,
    onChange,
  }: ToggleSwitchProps) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium">{label}</span>
          <span className="text-sm text-gray-500">{description}</span>
        </div>
        <button
          type="button"
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
            enabled ? "bg-primary-600" : "bg-gray-300"
          }`}
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange(!enabled)}
        >
          <span
            aria-hidden="true"
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    );
  };
  
  export default ToggleSwitch;