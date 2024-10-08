let words = `is	was	are	be	have
had	were	can	said	use
do	will	would	make	like
has	look	write	go	see
could	been	call	am	find
did	get	come	made	may
take	know	live	give	think
say	help	tell	follow	came
want	show	set	put	does
must	ask	went	read	need
move	try	change	play	spell
found	study	learn	should	add
keep	start	thought	saw	turn
might	close	seem	open	begin
got	run	walk	began	grow
took	carry	hear	stop	miss
eat	watch	let	cut	talk
being	leave word	time	number	way	people
water	day	part	sound	work
place	year	back	thing	name
sentence	man	line	boy	farm
end	men	land	home	hand
picture	air	animal	house	page
letter	point	mother	answer	America
world	food	country	plant	school
father	tree	city	earth	eye
head	story	example	life	paper
group	children	side	feet	car
mile	night	sea	river	state
book	idea	face	Indian	girl
mountain	list	song	family he	a	one	all	an
each	other	many	some	two
more	long	new	little	most
good	great	right	mean	old
any	same	three	small	another
large	big	even	such	different
kind	still	high	every	own
light	left	few	next	hard
both	important	white	four	second
enough	above	young not	when	there	how	up
out	then	so	no	first
now	only	very	just	where
much	before	too	also	around
well	here	why	again	off
away	near	below	last	never
always	together	often	once	later
far	really	almost	sometimes	soon of	to	in	for	on
with	at	from	by	about
into	down	over	after	through
between	under	along	until	without you	that	it	he	his
they	I	this	what	we
your	which	she	their	them
these	her	him	my	who
its	me	our	us	something
those and	as	or	but
if	than	because	while it's	don't`;

export let WORDS = words.replaceAll('\t', ' ').replaceAll('\n', ' ').split(' ');

export function getRandomWord() : string {
  let word = WORDS[Math.floor(Math.random() * WORDS.length)];
  return word;
}
export function getRandomList(size:number) : string[] {
  const wordList = []

  while (wordList.length < size) {
    wordList.push(getRandomWord());
  }

  return wordList;
}