
class Node {

    constructor(key, value = null, nextNode = null) {
        this.key = key,
        this.value = value,
        this.nextNode = nextNode
    }

}

class LinkedList {

    constructor() {
        this.head = null,
        this.tail = null
    }

    append(key, value) {
        let node = new Node(key, value);

        if (this.head === null) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.nextNode = node;
            this.tail = node;
        }

    }

    prepend(value) {
        let node = new Node(value);

        if (this.head === null) {
            this.head = node;
        } else {
            node.nextNode = this.head;
            this.head = node;
        }

    }

    getSize() {
        let size = 0;
        let current = this.head;

        while (current !== null) {
            current = current.nextNode;
            size++;
        }

        return size;
    }

    getHead() {
        return this.head;
    }

    getTail() {
        return this.tail;
    }

    getNodeAt(index) {
        let current = this.head;
        let i = 0;

        while (current !== null) {
            if (i === index) {
                return current;
            }

            current = current.nextNode;
            i++;
        }

        return "No Node At Given Index";

    }

    contains(item) {
        let current = this.head;

        while (current !== null) {
            if (current.value === item) {
                return true;
            }
            current = current.nextNode;
        }

        return false;
    }

    pop() {

        let newTail = this.getNodeAt(this.getSize() - 2);
        newTail.nextNode = null;
        this.tail = newTail;

    }

    findIndexOf(item) {
        let current = this.head;
        let i = 0

        while (current !== null) {
            if (current.value === item) {
                return i;
            }
            
            current = current.nextNode;
            i++;
        }

        return null;
    }

    toString() {
        let current = this.head;
        let string = `${current.value} -> `;

        while (current.nextNode !== null) {
            current = current.nextNode;
            string += `${current.value} -> `;
        }

        return `${string}null`;
    }

    insertNodeAt(newKey, newValue, index) {
        let previous = null;
        let current = this.head;

        let originalNode = this.getNodeAt(index);
        let newNode = new Node(newKey, newValue)

        while (current !== null && current !== this.getNodeAt(index)) {
            previous = current;
            current = current.nextNode;
        }

        if (current !== null) {
            previous.nextNode = newNode;
            newNode.nextNode = originalNode;
        }

    }

    removeNodeAt(index) {

        let previous = null;
        let current = this.head;

        if (this.head === this.getNodeAt(index)) {
            this.head = current.nextNode;
        }

        
        while (current !== null && current !== this.getNodeAt(index)) {
            previous = current;
            current = current.nextNode;
        }

        if (current !== null && current === this.tail) {
            previous.nextNode = null;
            this.tail = previous
        } else  if (current !== null) {
            previous.nextNode = current.nextNode;
        } else return "No Node At This Index";

    }
    
}


//Methods right now assume each bucket/linked list only has 1 Node;
class HashMap {

    constructor(size = 4, capacity = 0, loadFactor = 0.75) {
        this.buckets = new Array(size).fill(null).map((item) => new LinkedList);
        this.capacity = capacity;
        this.size = size;
        this.loadFactor = loadFactor;
    }

    hash(key) {
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
            hashCode %= this.buckets.length;
        }

        return hashCode;
    }

    set(k, val) {

        let index = this.hash(k);

        if (index < 0 || index >= this.buckets.length) {
            throw new Error("Trying to access index out of bound");
        }

        if (this.buckets[index].head !== null) {
            this.buckets[index].head.value = val;
        } else {
            this.buckets[index].append(k, val);
            this.capacity++;
        }

        if (this.capacity / this.size >= this.loadFactor) {
            this.size *= 2;
            let bucketsCopy = this.buckets;
            this.buckets = new Array(this.size).fill(null).map((item) => new LinkedList);

            bucketsCopy.forEach((bucket) => {
                if (bucket.head !== null) {
                    let i = bucketsCopy.indexOf(bucket);
                    this.buckets.splice(i, 1, bucket);
                }
            })

        }
    }

    get(key) {

        let index = this.hash(key);

        if (index < 0 || index >= this.buckets.length) {
            throw new Error("Trying to access index out of bound");
        }

        if (this.buckets[index] !== null) {

            return this.buckets[index].head.value;

        } else return null;

    }

    has(key) {

        let index = this.hash(key);

        if (index < 0 || index >= this.buckets.length) {
            throw new Error("Trying to access index out of bound");
        }

        return this.buckets[index].head !== null;

    }

    remove(key) {
        let index = this.hash(key);

        if (index < 0 || index >= this.buckets.length) {
            throw new Error("Trying to access index out of bound");
        }

        if (this.buckets[index].head !== null) {
            //Assume the bucket only has one item (which would be both the head & tail)
            this.buckets[index].head = null;
            this.buckets[index].tail = null;
            return true
        } 

        return false;

    }

    length() {

        let numberOfKeys = 0;

        this.buckets.forEach((bucket) => {
            if (bucket.head !== null && bucket.tail !== null) {
                numberOfKeys++
            }
        })

        return numberOfKeys;

    }

    clear() {
        
        this.buckets.forEach((bucket) => {
            if (bucket.head !== null && bucket.tail !== null) {
                bucket.head = null;
                bucket.tail = null;
            }
        })

    }

    keys() {

        const keyArray = [];

        this.buckets.forEach((bucket) => {
            if (bucket.head !== null && bucket.tail !== null) {
                keyArray.push(bucket.head.key);
            }
        })

        return keyArray;

    }

    values() {

        const valueArray = [];

        this.buckets.forEach((bucket) => {
            if (bucket.head !== null && bucket.tail !== null) {
                valueArray.push(bucket.head.value);
            }
        })

        return valueArray;

    }

    entries() {
        const entryArray = [];

        this.buckets.forEach((bucket) => {
            if (bucket.head !== null && bucket.tail !== null) {
                let pairArray = [];
                pairArray.push(bucket.head.key);
                pairArray.push(bucket.head.value);
                entryArray.push(pairArray);
            }
        })

        return entryArray;
    }

}

let map = new HashMap();
