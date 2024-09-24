[![Continuous Integration](https://github.com/kaiosilveira/separate-query-from-modifier-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/separate-query-from-modifier-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Separate Query From Modifier

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
function getTotalOutstandingAndSendBill() {
  const result = customer.invoices.reduce((total, each) => each.amount + total, 0);
  sendBill();
  return result;
}
```

</td>

<td>

```javascript
function totalOutstanding() {
  return customer.invoices.reduce((total, each) => each.amount + total, 0);
}

function sendBill() {
  emailGateway.send(formatBill(customer));
}
```

</td>
</tr>
</tbody>
</table>

Good code is about clarity. Good code looks obvious at first sight, or even pre-first sight, just by reading the name of a function. Side effects are the biggest antagonists of clarity: they cause chaos in an often uncontrolled way. This refactoring helps on bringing predictability and peace.

## Working example

Our working example is a modest program that searches for (and alert on) the presence of miscreants. The code look likes the following:

```javascript
function setOffAlarms() {
  console.log('Alarms have been set off!');
}

export function alertForMiscreant(people) {
  for (const p of people) {
    if (p === 'Don') {
      setOffAlarms();
      return 'Don';
    }
    if (p === 'John') {
      setOffAlarms();
      return 'John';
    }
  }
  return '';
}
```

The function we want to refactor here is `alertForMiscreant`, mainly because it has two jobs:

- Finding pre-determined miscreants in the least of people
- setting off the alarms when these people are found

As the refactoring name implies, we want to separate "querying" from "modifying" (in this case, causing a side effect in the form of setting off alarms).

### Test suite

The test suite covers miscreant detection and alarm configuration:

```javascript
describe('alertForMiscreant', () => {
  const spy = jest.spyOn(console, 'log');

  beforeEach(() => spy.mockClear());

  it('should set off alarms for Don', () => {
    const result = alertForMiscreant(['Don']);
    expect(result).toBe('Don');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set off alarms for John', () => {
    const reuslt = alertForMiscreant(['John']);
    expect(reuslt).toBe('John');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not set off alarms for other people', () => {
    const result = alertForMiscreant(['Alice']);
    expect(result).toBe('');
    expect(spy).not.toHaveBeenCalled();
  });
});
```

With that in place, we are ready to go.

### Steps

We start by copying the `alertForMiscreant` into a new function named `findMiscreant`:

```diff
@@ -15,3 +15,17 @@ export function alertForMiscreant(people) {
   }
   return '';
 }
+
+export function findMiscreant(people) {
+  for (const p of people) {
+    if (p === 'Don') {
+      setOffAlarms();
+      return 'Don';
+    }
+    if (p === 'John') {
+      setOffAlarms();
+      return 'John';
+    }
+  }
+  return '';
+}
```

Then, we remove any alarm side-effects from `findMiscreant`:

```diff
@@ -19,11 +19,9 @@ export function alertForMiscreant(people) {
 export function findMiscreant(people) {
   for (const p of people) {
     if (p === 'Don') {
-      setOffAlarms();
       return 'Don';
     }
     if (p === 'John') {
-      setOffAlarms();
       return 'John';
     }
   }
```

Finally, we can separate querying from alerting for miscreants in each caller:

```diff
@@ -1,4 +1,6 @@
-import { alertForMiscreant } from './miscreant-handling';
+import { alertForMiscreant, findMiscreant } from './miscreant-handling';
-const found = alertForMiscreant(['Don', 'John']);
+const people = ['Don', 'John'];
+const found = findMiscreant(people);
 console.log(found);
+alertForMiscreant(people);
```

And then we can safely remove return values from `alertForMiscreant`:

```diff
@@ -6,14 +6,11 @@ export function alertForMiscreant(people) {
   for (const p of people) {
     if (p === 'Don') {
       setOffAlarms();
-      return 'Don';
     }
     if (p === 'John') {
       setOffAlarms();
-      return 'John';
     }
   }
-  return '';
 }
 export function findMiscreant(people) {
```

As a last touch, we susbstitute `alertForMiscreant` logic, drastically simplifying it:

```diff
@@ -3,13 +3,8 @@ function setOffAlarms() {
 }
 export function alertForMiscreant(people) {
-  for (const p of people) {
-    if (p === 'Don') {
-      setOffAlarms();
-    }
-    if (p === 'John') {
-      setOffAlarms();
-    }
+  if (findMiscreant(people) !== '') {
+    setOffAlarms();
   }
 }
```

And that's it! Querying for miscreants and alerting when they're present in the list are two separate operations now.

### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                          | Message                                        |
| ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [fddf538](https://github.com/kaiosilveira/separate-query-from-modifier-refactoring/commit/fddf5385890fc4524e1fa2b9454020fd59a04802) | copy `alertForMiscreant` into `findMiscreant`  |
| [e287f54](https://github.com/kaiosilveira/separate-query-from-modifier-refactoring/commit/e287f5426bd1151ecf90254cb5a1c67f2fb3c1f3) | remove alarm side-effects of `findMiscreant`   |
| [5c74b86](https://github.com/kaiosilveira/separate-query-from-modifier-refactoring/commit/5c74b8694c72a7704bddc02a2ba038e676da6ab0) | separate querying from alerting for miscreants |
| [edbbdd5](https://github.com/kaiosilveira/separate-query-from-modifier-refactoring/commit/edbbdd53360657600506b626f03df31e671c4619) | remove return values from `alertForMiscreant`  |
| [21c39ff](https://github.com/kaiosilveira/separate-query-from-modifier-refactoring/commit/21c39ff27c0bf8751037936619acbeefe55bec2a) | susbstitute `alertForMiscreant` logic          |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/separate-query-from-modifier-refactoring/commits/main).
