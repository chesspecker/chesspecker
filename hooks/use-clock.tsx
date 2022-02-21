const useClock = (count: number): string => {
	return count < 10
		? '00:0' + count
		: count < 60
		? '00:' + count
		: count < 600
		? '0' +
		  Math.floor(count / 60) +
		  ':' +
		  (count % 60 < 10 ? '0' + (count % 60) : count % 60)
		: count < 3600
		? Math.floor(count / 60) +
		  ':' +
		  (count % 60 < 10 ? '0' + (count % 60) : count % 60)
		: count < 36_000
		? '0' +
		  Math.floor(count / 3600) +
		  ':' +
		  (count % 3600 < 10
				? '00:0' + (count % 3600)
				: count % 3600 < 60
				? '00:' + (count % 3600)
				: count % 3600 < 600
				? '0' +
				  Math.floor((count % 3600) / 60) +
				  ':' +
				  ((count % 3600) % 60 < 10
						? '0' + ((count % 3600) % 60)
						: (count % 3600) % 60)
				: Math.floor((count % 3600) / 60) +
				  ':' +
				  ((count % 3600) % 60 < 10
						? '0' + ((count % 3600) % 60)
						: (count % 3600) % 60))
		: Math.floor(count / 3600) +
		  ':' +
		  (count % 3600 < 10
				? '00:0' + (count % 3600)
				: count % 3600 < 60
				? '00:' + (count % 3600)
				: count % 3600 < 600
				? '0' +
				  Math.floor((count % 3600) / 60) +
				  ':' +
				  ((count % 3600) % 60 < 10
						? '0' + ((count % 3600) % 60)
						: (count % 3600) % 60)
				: Math.floor((count % 3600) / 60) +
				  ':' +
				  ((count % 3600) % 60 < 10
						? '0' + ((count % 3600) % 60)
						: (count % 3600) % 60));
};

export default useClock;
