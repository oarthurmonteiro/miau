type Value = string | undefined | null;

export default function className(...args: Array<Value>): string {
	return args.join(" ");
}
