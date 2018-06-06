OUTPUTS=$(patsubst %.md,%.html,$(wildcard *.md))

all: $(OUTPUTS)

%.html: %.md
	./emd.sh $? $@

