# set input to the search directory, otherwise ~ is used
if [ $# -eq 0 ]
then
	echo "No input string provided:"
	echo 'using "~" as the search directory.'
	SEARCH_DIR=~
else
	SEARCH_DIR=$1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
find $SEARCH_DIR -name "emd.sh" | while read x
do
	if [ "$SCRIPT_DIR" = "$( dirname $x )" ]
	then
		continue
	fi
	cd $SCRIPT_DIR
	cd $( dirname $x )
	cp $SCRIPT_DIR/* .
	find . -name "*.md" -maxdepth 1 -exec touch {} \;
	make
done

