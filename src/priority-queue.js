// Default cmp function, which simply returns 1, -1, or 0 if a > b, a < b, or
// otherwise respectively.
function defaultCmp(a, b) {
  if (a > b) return 1;
  else if (a < b) return -1;
  else return 0;
}

class PriorityQueue {
  // Constructor takes initial elements of the priority queue (which defaults to
  // an empty array) and a comparator (which defaults to defaultCmp). It
  // constructs a priority queue, where the given comparator will always be used
  // for comparisons, and enqueues the given initial elements.
  constructor(init = [], cmp  = defaultCmp) {
    this._cmp = cmp;
    
    // This priority queue is implemented as a binary min-heap represented by as
    // an array.
    this._heap = [];

    this.enqueue(...init);
  }

  // Define an iterator which successively dequeues from a clone of this
  // priority queue.
  [Symbol.iterator]() {

    // Clone this because we don't want to mutate the original priority queue by
    // iterating over its elements.
    var priorityQueue = this.clone();
    return {
      next() {
        return priorityQueue.length 
          ? { value: priorityQueue.dequeue() }
          : { done: true }
        ;
      }  
    };
  }

  // Shallow clone of the priority queue.
  clone() {

    // Should be O(n) time complexity, because elements enqueued directly from a
    // a heap will already be in the correct order and not need to be percolated
    // up.
    return new PriorityQueue(this._heap, this._cmp);
  }
 
  // Removes the minimum element of the priority queue, Returns undefined if the
  // priority queue is empty.
  dequeue() {
    // If there is only one element in the priority queue, just remove and
    // return it. If there are zero, return undefined.
    if (this._heap.length < 2) return this._heap.pop();

    // Save the return value, and put the last leaf of the heap at the root.
    let returnValue = this._heap[0];
    this._heap[0] = this._heap.pop();
    
    // The binary heap is represented as an array, where given an element at
    // index i, the first child is (i * 2) + 1, and the second child is at
    // (i * 2) + 2.
    //
    // Percolate down:
    // Initialize i, childI1 and childI2 at the root and its children
    // respectively. let nextI be the index of the minimum element of the
    // current element and its children. Stop if we've reached the end of the
    // heap or if the minimum element is the current element at i. Otherwise, 
    // swap the current element at i with the element at nextI, and continue the
    // loop. For the next iteration of the loop, i becomes nextI (the index 
    // whose element we'd swapped), and childI1 and childI2 are the indices of 
    // the children.
    for (
      let i = 0, childI1 = 1, childI2 = 2, nextI;
      childI1 < this._heap.length && (
        nextI = this._minInHeap(
          i, childI1, childI2 < this._heap.length ? childI2 : void(0)
        )
      ) !== i;
      i = nextI, childI1 = (i * 2) + 1, childI2 = childI1 + 1
    ) this._swapInHeap(i, nextI);
    
    return returnValue;
  }

  // Inserts each of the given arguments into the appropriate place in the
  // priority queue. Returns the resulting length of the priority queue.
  enqueue(...newValues) {
    for (let newValue of newValues) {
      // The enqueued element becomes the last leaf of the heap, which will be
      // percolated up as necessary.
      this._heap.push(newValue);

      // The binary heap is represented as an array, where given an element at
      // index i, its parent is at floor((i - 1) / 2).
      //
      // Percolate up:
      // Start the loop at the last leaf of the heap. Stop the loop if the 
      // current element is the root of the heap or if the current element 
      // greater than or equal to the parent. Otherwise, swap the current 
      // element with its parent, and continue the loop at the parent.
  
      for (
        let i = this._heap.length - 1, parentI = Math.floor((i - 1) / 2);
        i > 0 && this._cmpInHeap(i, parentI) < 0;
        i = parentI, parentI = Math.floor((parentI - 1) / 2)
      ) this._swapInHeap(i, parentI);
    }

    return this.length;
  }

  // Returns the minimum element of the priority queue without removing it.
  peek() {
    return this._heap[0];
  }

  // JSON.stringify of this priority queue should be the JSON of the elements
  // of the priority queue in a sorted array.
  toJSON() {
    return Array.from(this);
  }

  // The string form of this priority queue should be the string form of an 
  // array of this priority queue's elements in sorted order.
  toString() {
    return Array.from(this).toString();
  }

  // length accessor is simply the number of elements currently in the priority
  // queue.
  get length() {
    return this._heap.length;
  }

  // Helper method. Returns the result of the comparator function on the
  // elements located at the given indices in the heap array.
  _cmpInHeap(i1, i2) {
    return this._cmp(this._heap[i1], this._heap[i2]);
  }

  // Helper method. Given two or three indices of the heap array, compares the
  // corresponding elements and returns the index to the minimum element of
  // them.
  _minInHeap(i1, i2, i3) {

    // First compare the elements at the first two given indices. Return the 
    // index for minimum of them, or if we are given a third index, compare with
    // that corresponding element and return the minimum of them.
    let i = this._cmpInHeap(i1, i2) > 0 ? i2 : i1;
    if (typeof i3 === 'undefined') return i;
    else return this._cmpInHeap(i, i3) > 0 ? i3 : i;
  }

  // Helper method. Swaps the elements at the given indices of the heap array. 
  _swapInHeap(i1, i2) {
    let tmp = this._heap[i1];
    this._heap[i1] = this._heap[i2];
    this._heap[i2] = tmp;
  }
};

export default PriorityQueue;