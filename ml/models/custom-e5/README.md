---
tags:
- sentence-transformers
- sentence-similarity
- feature-extraction
- dense
- generated_from_trainer
- dataset_size:64
- loss:TripletLoss
base_model: sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
widget:
- source_sentence: What is mentioned about have?
  sentences:
  - Thus, P (X = 4) = (4 4)(48 1 ) (52 5 ) We have our values of P (X = x) for all
    possible X, and thus we have our probablity mass function describing the distribution
    of X. 3
  - '10. Suppose the probability mass function of a discrete random variable X is
    given by the following table: x P (X = x) -1 0.2 -0.5 0.25 0.1 0.1 0.5 0.1 1 0.35
    Find and graph the corresponding distribution function F (x). Solution: Recall
    that F (x) = P (X≤ x). F (x) is deﬁned for all real numbers, and we must pay special
    attention to the cases when X = x while building our function F (x). We should
    observe that F (−1) = 0.2, F (−0.5) = 0.2 + 0.25 = 0.45, F (0.1) = 0.2 + 0.25
    + 0.1 = 0.55, F (0.5) = 0.2 + 0.25 + 0.1 + 0.1 = 0.65, and F (1) = 0.2 + 0.25
    + 0.1 + 0.1 + 0.35 = 1. Thus, F (x) is a piecewise function as follows: F (x)
    =    0 x <−1 0.2 −1≤ x <−0.5 0.45 −0.5≤ x < 0.1 0.55 0 .1≤ x <
    0.5 0.65 0 .5≤ x < 1 1 1 ≤ x And our graph for F (x) is drawn as follows: −2 −1
    1 2 −1 −0.5 0.5 1 1.5 4'
  - '8. You draw 5 cards from a standard deck of 52 cards without replacement. Let
    X denote the number of aces in your hand. Find the probability mass function describing
    the distribution of X. Solution: Our random variable X can take on 5 possible
    values. In our hand, we can either have 0 aces ( X = 0), 1 ace ( X = 1), 2 aces
    ( X = 2), 3 aces ( X = 3), or 4 aces (X = 4). Note that we cannot have X = 5 as
    this would mean we have 5 aces in our hand, which is impossible to do given a
    standard deck of 52 cards. We have (52 5 ) ways of picking 5 cards from the deck
    of 52. There are 4 aces, and 48 non-aces in the deck. The probabilities are calculated
    as follows: For X = 0 : We will have 0 aces and 5 non-aces. Thus, P (X = 0) =
    (4 0)(48 5 ) (52 5 ) For X = 1 : We will have 1 ace and 4 non-aces. Thus, P (X
    = 1) = (4 1)(48 4 ) (52 5 ) For X = 2 : We will have 2 aces and 3 non-aces. Thus,
    P (X = 2) = (4 2)(48 3 ) (52 5 ) For X = 3 : We will have 3 aces and 2 non-aces.
    Thus, P (X = 3) = (4 3)(48 2 ) (52 5 ) For X = 4 : We will have 4 aces and 1 non-aces.'
- source_sentence: 'Summarize this: F O C U S C O M P U T E'
  sentences:
  - 'F O C U S C O M P U T E R J u n e 2 0 2 4 - J U L Y 2 0 2 5 A D D I T I O N A
    L I N F O R M A T I O N T e c h n i c a l S k i l l s : P r o j e c t M a n a
    g e m e n t , S t r u c t u r a l A n a l y s i s , R o b o t i c s a n d A u
    t o m a t i o n L a n g u a g e s : E n g l i s h , H i n d i , M a r a t h i
    P r o j e c t s : J y e s t a A s s o c i a t e s S u c c e s s f u l l y c o
    m p l e t e d t r a i n i n g a n d i n t e r n s h i p i n A r t i f i c i a
    l I n t e l l i g e n c e ( A I ) a t J y e s t a A s s o c i a t e s ( A s s
    o c i a t e d w i t h W i p r o ) T h e p r o g r a m i n c l u d e d b o t h
    t h e o r e t i c a l l e a r n i n g a n d p r a c t i c a l s e s s i o n s
    , p r o v i d i n g h a n d s - o n e x p o s u r e a n d i n - d e p t h u n
    d e r s t a n d i n g o f A r t i f i c i a l I n t e l l i g e n c e c o n c
    e p t s a n d a p p l i c a t i o n . N O V 2 0 2 5 - D E C 2 0 2 5 D I P L O
    M A I N C O M P U T E R E N G I N E E R I N G 2 0 2 3 - 2 0 2 5 + 9 1 8 8 4 9
    7 2 3 6 0 4 | t h a k a r e l a l i t 6 1 @ g m a i l . c o m | S h r i r a m
    p u r , d i s t - A . N a g a r , M a h a r a s h t r a S . J .'
  - '6. An urn contains ﬁve green balls, two blue balls, and three red balls. You
    remove three balls at random without replacement. Let X denote the number of red
    balls. Find the probability mass function describing the distribution of X. Solution:
    Our random variable X can take on 4 possible values. From our removal of the three
    balls, we can end up with 0 red balls, 1 red ball, 2 red balls, or 3 red balls.
    Thus, we can have X = 0, X = 1, X = 2, or X = 3. Now, we should calculate the
    probability of each possible value of X. There are 10 balls in total, and we are
    picking 3 without replacement. Thus, there are (10 3 ) total ways to remove three
    balls without replacement from the urn. There are 3 red balls and 7 non-red balls.
    The probabilities are calculated as follows: For X = 0 : We will have 0 red balls
    and 3 non-red balls. Thus, P (X = 0) = (3 0)(7 3) (10 3 ) For X = 1 : We will
    have 1 red ball and 2 non-red balls. Thus P (X = 1) = (3 1)(7 2) (10 3 ) For X
    = 2 : We will have 2 red balls and 1 non-red ball. Thus P (X = 2) = (3 2)(7 1)
    (10 3 ) For X = 3 : We will have 3 red balls and 0 non-red balls.'
  - Univ Fees 2444.00 2444.00 2444.00 4 Development Fees 24392.00 24392.00 24392.00
    5 Tuition Fees 81304.00 81304.00 81304.00 6 Student Insurance 454.00 454.00 454.00
    7 Cost of Books and Equipment (*) 0.00 0.00 0.00 8 Hostel 0.00 0.00 0.00 9 Laptop/Other
    0.00 0.00 0.00 Total (Rs.) 111394.00 110794.00 110794.00 (*) Required to be purchased
    directly by the student. (**) Required to be paid directly by the student. Subject
    to change in fees by the Government of Maharashtra and Savitribai Phule Pune University
    from time to time.These fees are based on fees structure approved by fees approving
    committee and is subjudice. This may change as may be finally fixed by the Hon’ble
    Fees Regulating Authority (FRA). Vishwakarma Institute of Technology ( An Autonomous
    Institute Affiliated to Savitribai Phule Pune University )
- source_sentence: What does this section say about F O C U S C O M P U T E R J u
    n e 2 0 2 4 - J U L Y 2 0 2 5 ?
  sentences:
  - '10. Suppose the probability mass function of a discrete random variable X is
    given by the following table: x P (X = x) -1 0.2 -0.5 0.25 0.1 0.1 0.5 0.1 1 0.35
    Find and graph the corresponding distribution function F (x). Solution: Recall
    that F (x) = P (X≤ x). F (x) is deﬁned for all real numbers, and we must pay special
    attention to the cases when X = x while building our function F (x). We should
    observe that F (−1) = 0.2, F (−0.5) = 0.2 + 0.25 = 0.45, F (0.1) = 0.2 + 0.25
    + 0.1 = 0.55, F (0.5) = 0.2 + 0.25 + 0.1 + 0.1 = 0.65, and F (1) = 0.2 + 0.25
    + 0.1 + 0.1 + 0.35 = 1. Thus, F (x) is a piecewise function as follows: F (x)
    =    0 x <−1 0.2 −1≤ x <−0.5 0.45 −0.5≤ x < 0.1 0.55 0 .1≤ x <
    0.5 0.65 0 .5≤ x < 1 1 1 ≤ x And our graph for F (x) is drawn as follows: −2 −1
    1 2 −1 −0.5 0.5 1 1.5 4'
  - 'F O C U S C O M P U T E R J u n e 2 0 2 4 - J U L Y 2 0 2 5 A D D I T I O N A
    L I N F O R M A T I O N T e c h n i c a l S k i l l s : P r o j e c t M a n a
    g e m e n t , S t r u c t u r a l A n a l y s i s , R o b o t i c s a n d A u
    t o m a t i o n L a n g u a g e s : E n g l i s h , H i n d i , M a r a t h i
    P r o j e c t s : J y e s t a A s s o c i a t e s S u c c e s s f u l l y c o
    m p l e t e d t r a i n i n g a n d i n t e r n s h i p i n A r t i f i c i a
    l I n t e l l i g e n c e ( A I ) a t J y e s t a A s s o c i a t e s ( A s s
    o c i a t e d w i t h W i p r o ) T h e p r o g r a m i n c l u d e d b o t h
    t h e o r e t i c a l l e a r n i n g a n d p r a c t i c a l s e s s i o n s
    , p r o v i d i n g h a n d s - o n e x p o s u r e a n d i n - d e p t h u n
    d e r s t a n d i n g o f A r t i f i c i a l I n t e l l i g e n c e c o n c
    e p t s a n d a p p l i c a t i o n . N O V 2 0 2 5 - D E C 2 0 2 5 D I P L O
    M A I N C O M P U T E R E N G I N E E R I N G 2 0 2 3 - 2 0 2 5 + 9 1 8 8 4 9
    7 2 3 6 0 4 | t h a k a r e l a l i t 6 1 @ g m a i l . c o m | S h r i r a m
    p u r , d i s t - A . N a g a r , M a h a r a s h t r a S . J .'
  - '8. You draw 5 cards from a standard deck of 52 cards without replacement. Let
    X denote the number of aces in your hand. Find the probability mass function describing
    the distribution of X. Solution: Our random variable X can take on 5 possible
    values. In our hand, we can either have 0 aces ( X = 0), 1 ace ( X = 1), 2 aces
    ( X = 2), 3 aces ( X = 3), or 4 aces (X = 4). Note that we cannot have X = 5 as
    this would mean we have 5 aces in our hand, which is impossible to do given a
    standard deck of 52 cards. We have (52 5 ) ways of picking 5 cards from the deck
    of 52. There are 4 aces, and 48 non-aces in the deck. The probabilities are calculated
    as follows: For X = 0 : We will have 0 aces and 5 non-aces. Thus, P (X = 0) =
    (4 0)(48 5 ) (52 5 ) For X = 1 : We will have 1 ace and 4 non-aces. Thus, P (X
    = 1) = (4 1)(48 4 ) (52 5 ) For X = 2 : We will have 2 aces and 3 non-aces. Thus,
    P (X = 2) = (4 2)(48 3 ) (52 5 ) For X = 3 : We will have 3 aces and 2 non-aces.
    Thus, P (X = 3) = (4 3)(48 2 ) (52 5 ) For X = 4 : We will have 4 aces and 1 non-aces.'
- source_sentence: Explain the main point in this paragraph.
  sentences:
  - Behrouz A. Forouzan ,“Data Communication and Networking”, 4th edition, Tata McGraw
    Hill Andrew S. Tanenbaum, “Computer Networks” ,5th Edition, Pearson Education
  - '10. Suppose the probability mass function of a discrete random variable X is
    given by the following table: x P (X = x) -1 0.2 -0.5 0.25 0.1 0.1 0.5 0.1 1 0.35
    Find and graph the corresponding distribution function F (x). Solution: Recall
    that F (x) = P (X≤ x). F (x) is deﬁned for all real numbers, and we must pay special
    attention to the cases when X = x while building our function F (x). We should
    observe that F (−1) = 0.2, F (−0.5) = 0.2 + 0.25 = 0.45, F (0.1) = 0.2 + 0.25
    + 0.1 = 0.55, F (0.5) = 0.2 + 0.25 + 0.1 + 0.1 = 0.65, and F (1) = 0.2 + 0.25
    + 0.1 + 0.1 + 0.35 = 1. Thus, F (x) is a piecewise function as follows: F (x)
    =    0 x <−1 0.2 −1≤ x <−0.5 0.45 −0.5≤ x < 0.1 0.55 0 .1≤ x <
    0.5 0.65 0 .5≤ x < 1 1 1 ≤ x And our graph for F (x) is drawn as follows: −2 −1
    1 2 −1 −0.5 0.5 1 1.5 4'
  - Thus P (X = 3) = (3 3)(7 0) (10 3 ) We have our values of P (X = x) for all possible
    X, and thus we have our probablity mass function describing the distribution of
    X. 2
- source_sentence: 'Summarize this: 8.'
  sentences:
  - '10. Suppose the probability mass function of a discrete random variable X is
    given by the following table: x P (X = x) -1 0.2 -0.5 0.25 0.1 0.1 0.5 0.1 1 0.35
    Find and graph the corresponding distribution function F (x). Solution: Recall
    that F (x) = P (X≤ x). F (x) is deﬁned for all real numbers, and we must pay special
    attention to the cases when X = x while building our function F (x). We should
    observe that F (−1) = 0.2, F (−0.5) = 0.2 + 0.25 = 0.45, F (0.1) = 0.2 + 0.25
    + 0.1 = 0.55, F (0.5) = 0.2 + 0.25 + 0.1 + 0.1 = 0.65, and F (1) = 0.2 + 0.25
    + 0.1 + 0.1 + 0.35 = 1. Thus, F (x) is a piecewise function as follows: F (x)
    =    0 x <−1 0.2 −1≤ x <−0.5 0.45 −0.5≤ x < 0.1 0.55 0 .1≤ x <
    0.5 0.65 0 .5≤ x < 1 1 1 ≤ x And our graph for F (x) is drawn as follows: −2 −1
    1 2 −1 −0.5 0.5 1 1.5 4'
  - '8. You draw 5 cards from a standard deck of 52 cards without replacement. Let
    X denote the number of aces in your hand. Find the probability mass function describing
    the distribution of X. Solution: Our random variable X can take on 5 possible
    values. In our hand, we can either have 0 aces ( X = 0), 1 ace ( X = 1), 2 aces
    ( X = 2), 3 aces ( X = 3), or 4 aces (X = 4). Note that we cannot have X = 5 as
    this would mean we have 5 aces in our hand, which is impossible to do given a
    standard deck of 52 cards. We have (52 5 ) ways of picking 5 cards from the deck
    of 52. There are 4 aces, and 48 non-aces in the deck. The probabilities are calculated
    as follows: For X = 0 : We will have 0 aces and 5 non-aces. Thus, P (X = 0) =
    (4 0)(48 5 ) (52 5 ) For X = 1 : We will have 1 ace and 4 non-aces. Thus, P (X
    = 1) = (4 1)(48 4 ) (52 5 ) For X = 2 : We will have 2 aces and 3 non-aces. Thus,
    P (X = 2) = (4 2)(48 3 ) (52 5 ) For X = 3 : We will have 3 aces and 2 non-aces.
    Thus, P (X = 3) = (4 3)(48 2 ) (52 5 ) For X = 4 : We will have 4 aces and 1 non-aces.'
  - 'Network Layer: (5 Hours) Network Layer: Network Layer Services. IPv4 Addresses:
    Static and Dynamic Configuration Classful and Classless Addressing, Special Addresses,
    Subnetting, Super -netting, Delivery and Forwarding of IP Packet, NAT (Network
    Address Translation). IPv4: Datagram’s, Fragmentation, Options, Checksum. IPv6:
    Addressing: Notations, Address Space, Packet Format SECTION-II Network Layer Routing
    Protocols: (5 Hours) Routing: Optimality Principle, Static vs Dynamic Routing
    Tables, Routing Protocol: Intra and Inter Domain Routing. Unicast Routing Algorithms:
    Shortest Path Routing, Flooding, Distance Vector Routing, Link State Routing,
    Path State Routing. Interior Routing algorithms: RIP, EIGRP, OSPF Exterior Routing
    Algorithms: BGP Transport Layer: (5 Hours) Transport layer: Transport layer services
    & Duties, Transport Control Protocol: TCP header, Connection Establishment, Flow
    control, Congestion Control: Leaky Bucket, Token Bucket, Load Shedding and TCP
    Timers. User Datagram Protocol: UDP header, Datagram, Services, Applications,
    Socket: Primitives, TCP & UDP Sockets.'
pipeline_tag: sentence-similarity
library_name: sentence-transformers
metrics:
- cosine_accuracy
model-index:
- name: SentenceTransformer based on sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
  results:
  - task:
      type: triplet
      name: Triplet
    dataset:
      name: val triplets
      type: val-triplets
    metrics:
    - type: cosine_accuracy
      value: 0.625
      name: Cosine Accuracy
---

# SentenceTransformer based on sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2

This is a [sentence-transformers](https://www.SBERT.net) model finetuned from [sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2). It maps sentences & paragraphs to a 384-dimensional dense vector space and can be used for semantic textual similarity, semantic search, paraphrase mining, text classification, clustering, and more.

## Model Details

### Model Description
- **Model Type:** Sentence Transformer
- **Base model:** [sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2) <!-- at revision e8f8c211226b894fcb81acc59f3b34ba3efd5f42 -->
- **Maximum Sequence Length:** 128 tokens
- **Output Dimensionality:** 384 dimensions
- **Similarity Function:** Cosine Similarity
<!-- - **Training Dataset:** Unknown -->
<!-- - **Language:** Unknown -->
<!-- - **License:** Unknown -->

### Model Sources

- **Documentation:** [Sentence Transformers Documentation](https://sbert.net)
- **Repository:** [Sentence Transformers on GitHub](https://github.com/huggingface/sentence-transformers)
- **Hugging Face:** [Sentence Transformers on Hugging Face](https://huggingface.co/models?library=sentence-transformers)

### Full Model Architecture

```
SentenceTransformer(
  (0): Transformer({'max_seq_length': 128, 'do_lower_case': False, 'architecture': 'BertModel'})
  (1): Pooling({'word_embedding_dimension': 384, 'pooling_mode_cls_token': False, 'pooling_mode_mean_tokens': True, 'pooling_mode_max_tokens': False, 'pooling_mode_mean_sqrt_len_tokens': False, 'pooling_mode_weightedmean_tokens': False, 'pooling_mode_lasttoken': False, 'include_prompt': True})
)
```

## Usage

### Direct Usage (Sentence Transformers)

First install the Sentence Transformers library:

```bash
pip install -U sentence-transformers
```

Then you can load this model and run inference.
```python
from sentence_transformers import SentenceTransformer

# Download from the 🤗 Hub
model = SentenceTransformer("sentence_transformers_model_id")
# Run inference
sentences = [
    'Summarize this: 8.',
    '8. You draw 5 cards from a standard deck of 52 cards without replacement. Let X denote the number of aces in your hand. Find the probability mass function describing the distribution of X. Solution: Our random variable X can take on 5 possible values. In our hand, we can either have 0 aces ( X = 0), 1 ace ( X = 1), 2 aces ( X = 2), 3 aces ( X = 3), or 4 aces (X = 4). Note that we cannot have X = 5 as this would mean we have 5 aces in our hand, which is impossible to do given a standard deck of 52 cards. We have (52 5 ) ways of picking 5 cards from the deck of 52. There are 4 aces, and 48 non-aces in the deck. The probabilities are calculated as follows: For X = 0 : We will have 0 aces and 5 non-aces. Thus, P (X = 0) = (4 0)(48 5 ) (52 5 ) For X = 1 : We will have 1 ace and 4 non-aces. Thus, P (X = 1) = (4 1)(48 4 ) (52 5 ) For X = 2 : We will have 2 aces and 3 non-aces. Thus, P (X = 2) = (4 2)(48 3 ) (52 5 ) For X = 3 : We will have 3 aces and 2 non-aces. Thus, P (X = 3) = (4 3)(48 2 ) (52 5 ) For X = 4 : We will have 4 aces and 1 non-aces.',
    '10. Suppose the probability mass function of a discrete random variable X is given by the following table: x P (X = x) -1 0.2 -0.5 0.25 0.1 0.1 0.5 0.1 1 0.35 Find and graph the corresponding distribution function F (x). Solution: Recall that F (x) = P (X≤ x). F (x) is deﬁned for all real numbers, and we must pay special attention to the cases when X = x while building our function F (x). We should observe that F (−1) = 0.2, F (−0.5) = 0.2 + 0.25 = 0.45, F (0.1) = 0.2 + 0.25 + 0.1 = 0.55, F (0.5) = 0.2 + 0.25 + 0.1 + 0.1 = 0.65, and F (1) = 0.2 + 0.25 + 0.1 + 0.1 + 0.35 = 1. Thus, F (x) is a piecewise function as follows: F (x) = \uf8f1 \uf8f4\uf8f4\uf8f4\uf8f4\uf8f4\uf8f4\uf8f2 \uf8f4\uf8f4\uf8f4\uf8f4\uf8f4\uf8f4\uf8f3 0 x <−1 0.2 −1≤ x <−0.5 0.45 −0.5≤ x < 0.1 0.55 0 .1≤ x < 0.5 0.65 0 .5≤ x < 1 1 1 ≤ x And our graph for F (x) is drawn as follows: −2 −1 1 2 −1 −0.5 0.5 1 1.5 4',
]
embeddings = model.encode(sentences)
print(embeddings.shape)
# [3, 384]

# Get the similarity scores for the embeddings
similarities = model.similarity(embeddings, embeddings)
print(similarities)
# tensor([[1.0000, 0.1879, 0.1291],
#         [0.1879, 1.0000, 0.7869],
#         [0.1291, 0.7869, 1.0000]])
```

<!--
### Direct Usage (Transformers)

<details><summary>Click to see the direct usage in Transformers</summary>

</details>
-->

<!--
### Downstream Usage (Sentence Transformers)

You can finetune this model on your own dataset.

<details><summary>Click to expand</summary>

</details>
-->

<!--
### Out-of-Scope Use

*List how the model may foreseeably be misused and address what users ought not to do with the model.*
-->

## Evaluation

### Metrics

#### Triplet

* Dataset: `val-triplets`
* Evaluated with [<code>TripletEvaluator</code>](https://sbert.net/docs/package_reference/sentence_transformer/evaluation.html#sentence_transformers.evaluation.TripletEvaluator)

| Metric              | Value     |
|:--------------------|:----------|
| **cosine_accuracy** | **0.625** |

<!--
## Bias, Risks and Limitations

*What are the known or foreseeable issues stemming from this model? You could also flag here known failure cases or weaknesses of the model.*
-->

<!--
### Recommendations

*What are recommendations with respect to the foreseeable issues? For example, filtering explicit content.*
-->

## Training Details

### Training Dataset

#### Unnamed Dataset

* Size: 64 training samples
* Columns: <code>sentence_0</code>, <code>sentence_1</code>, and <code>sentence_2</code>
* Approximate statistics based on the first 64 samples:
  |         | sentence_0                                                                        | sentence_1                                                                          | sentence_2                                                                           |
  |:--------|:----------------------------------------------------------------------------------|:------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------|
  | type    | string                                                                            | string                                                                              | string                                                                               |
  | details | <ul><li>min: 8 tokens</li><li>mean: 15.55 tokens</li><li>max: 40 tokens</li></ul> | <ul><li>min: 51 tokens</li><li>mean: 109.7 tokens</li><li>max: 128 tokens</li></ul> | <ul><li>min: 54 tokens</li><li>mean: 112.58 tokens</li><li>max: 128 tokens</li></ul> |
* Samples:
  | sentence_0                                                             | sentence_1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | sentence_2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
  |:-----------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | <code>What is mentioned about function?</code>                         | <code>10. Suppose the probability mass function of a discrete random variable X is given by the following table: x P (X = x) -1 0.2 -0.5 0.25 0.1 0.1 0.5 0.1 1 0.35 Find and graph the corresponding distribution function F (x). Solution: Recall that F (x) = P (X≤ x). F (x) is deﬁned for all real numbers, and we must pay special attention to the cases when X = x while building our function F (x). We should observe that F (−1) = 0.2, F (−0.5) = 0.2 + 0.25 = 0.45, F (0.1) = 0.2 + 0.25 + 0.1 = 0.55, F (0.5) = 0.2 + 0.25 + 0.1 + 0.1 = 0.65, and F (1) = 0.2 + 0.25 + 0.1 + 0.1 + 0.35 = 1. Thus, F (x) is a piecewise function as follows: F (x) =    0 x <−1 0.2 −1≤ x <−0.5 0.45 −0.5≤ x < 0.1 0.55 0 .1≤ x < 0.5 0.65 0 .5≤ x < 1 1 1 ≤ x And our graph for F (x) is drawn as follows: −2 −1 1 2 −1 −0.5 0.5 1 1.5 4</code>                                                                                                                                                                                           | <code>8. You draw 5 cards from a standard deck of 52 cards without replacement. Let X denote the number of aces in your hand. Find the probability mass function describing the distribution of X. Solution: Our random variable X can take on 5 possible values. In our hand, we can either have 0 aces ( X = 0), 1 ace ( X = 1), 2 aces ( X = 2), 3 aces ( X = 3), or 4 aces (X = 4). Note that we cannot have X = 5 as this would mean we have 5 aces in our hand, which is impossible to do given a standard deck of 52 cards. We have (52 5 ) ways of picking 5 cards from the deck of 52. There are 4 aces, and 48 non-aces in the deck. The probabilities are calculated as follows: For X = 0 : We will have 0 aces and 5 non-aces. Thus, P (X = 0) = (4 0)(48 5 ) (52 5 ) For X = 1 : We will have 1 ace and 4 non-aces. Thus, P (X = 1) = (4 1)(48 4 ) (52 5 ) For X = 2 : We will have 2 aces and 3 non-aces. Thus, P (X = 2) = (4 2)(48 3 ) (52 5 ) For X = 3 : We will have 3 aces and 2 non-aces. Thus, P (X = 3) = (4 3)(48 2 )...</code> |
  | <code>What does this section say about balls, red, non-red?</code>     | <code>6. An urn contains ﬁve green balls, two blue balls, and three red balls. You remove three balls at random without replacement. Let X denote the number of red balls. Find the probability mass function describing the distribution of X. Solution: Our random variable X can take on 4 possible values. From our removal of the three balls, we can end up with 0 red balls, 1 red ball, 2 red balls, or 3 red balls. Thus, we can have X = 0, X = 1, X = 2, or X = 3. Now, we should calculate the probability of each possible value of X. There are 10 balls in total, and we are picking 3 without replacement. Thus, there are (10 3 ) total ways to remove three balls without replacement from the urn. There are 3 red balls and 7 non-red balls. The probabilities are calculated as follows: For X = 0 : We will have 0 red balls and 3 non-red balls. Thus, P (X = 0) = (3 0)(7 3) (10 3 ) For X = 1 : We will have 1 red ball and 2 non-red balls. Thus P (X = 1) = (3 1)(7 2) (10 3 ) For X = 2 : We will have 2 red balls...</code> | <code>Thus, P (X = 4) = (4 4)(48 1 ) (52 5 ) We have our values of P (X = x) for all possible X, and thus we have our probablity mass function describing the distribution of X. 3</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
  | <code>What does this section say about network, framing, layer?</code> | <code>Type of Computer Network : LAN, MAN, WAN, PAN, Ad-hoc Networks. Network Topologies : Bus, Ring, Tree, Star, Mesh, Hybrid Transmission media- Guided media, unguided media. Transmission Modes- Simplex, Half-Duplex and Full-Duplex. Network Devices- Hub, Repeater, Bridge, Switch, Router, Gateways and Router Network Models: OSI Model, TCP/IP Model. Data Link Layer: (5 Hours) Data Link Layer: Data Link Layer Services, Error Detection and Correction: Linear Block Codes: hamming code, Hamming Distance, parity check code. Cyclic Codes: CRC (Polynomials), Internet Checksum. Framing: fixed-size framing, variable size framing. Flow control Protocols: Stop-and-Wait Automatic Repeat Request (ARQ), go-back-n ARQ, Selective repeat ARQ, piggybacking. Random Access Techniques: CSMA, CSMA/CD, CSMA/CA, Controlled Access Techniques: Reservation, Polling, Token Passing</code>                                                                                                                                                 | <code>12. Let X be a random variable with distribution function F (x) =    0 x < 0 0.05 0 ≤ x < 1.3 0.30 1 .3≤ x < 1.7 0.85 1 .7≤ x < 1.9 0.90 1 .9≤ x < 2 1.0 2 ≤ x Determine the probability mass function of X. Solution: We should look at the points of F (x) ”jumps”. This will give us the points where P (X = x) has a nonzero value. The size of the ”jump” will be equal to the prob- ability that X takes on at that value. By looking at our distribution function F (x), we should observe that these ”jumps” occur at X = 0, X = 1.3, X = 1.7, X = 1.9, and X = 2. Furthermore, by looking at the corresponding size of these ”jumps” we obtain our probability mass function: P (X = 0) = 0.05 P (X = 1.3) = 0.25 P (X = 1.7) = 0.55 P (X = 1.9) = 0.05 P (X = 2) = 0.10 5</code>                                                                                                                                                                                                                                          |
* Loss: [<code>TripletLoss</code>](https://sbert.net/docs/package_reference/sentence_transformer/losses.html#tripletloss) with these parameters:
  ```json
  {
      "distance_metric": "TripletDistanceMetric.EUCLIDEAN",
      "triplet_margin": 5
  }
  ```

### Training Hyperparameters
#### Non-Default Hyperparameters

- `num_train_epochs`: 1
- `eval_strategy`: steps
- `multi_dataset_batch_sampler`: round_robin

#### All Hyperparameters
<details><summary>Click to expand</summary>

- `per_device_train_batch_size`: 8
- `num_train_epochs`: 1
- `max_steps`: -1
- `learning_rate`: 5e-05
- `lr_scheduler_type`: linear
- `lr_scheduler_kwargs`: None
- `warmup_steps`: 0
- `optim`: adamw_torch_fused
- `optim_args`: None
- `weight_decay`: 0.0
- `adam_beta1`: 0.9
- `adam_beta2`: 0.999
- `adam_epsilon`: 1e-08
- `optim_target_modules`: None
- `gradient_accumulation_steps`: 1
- `average_tokens_across_devices`: True
- `max_grad_norm`: 1
- `label_smoothing_factor`: 0.0
- `bf16`: False
- `fp16`: False
- `bf16_full_eval`: False
- `fp16_full_eval`: False
- `tf32`: None
- `gradient_checkpointing`: False
- `gradient_checkpointing_kwargs`: None
- `torch_compile`: False
- `torch_compile_backend`: None
- `torch_compile_mode`: None
- `use_liger_kernel`: False
- `liger_kernel_config`: None
- `use_cache`: False
- `neftune_noise_alpha`: None
- `torch_empty_cache_steps`: None
- `auto_find_batch_size`: False
- `log_on_each_node`: True
- `logging_nan_inf_filter`: True
- `include_num_input_tokens_seen`: no
- `log_level`: passive
- `log_level_replica`: warning
- `disable_tqdm`: False
- `project`: huggingface
- `trackio_space_id`: trackio
- `eval_strategy`: steps
- `per_device_eval_batch_size`: 8
- `prediction_loss_only`: True
- `eval_on_start`: False
- `eval_do_concat_batches`: True
- `eval_use_gather_object`: False
- `eval_accumulation_steps`: None
- `include_for_metrics`: []
- `batch_eval_metrics`: False
- `save_only_model`: False
- `save_on_each_node`: False
- `enable_jit_checkpoint`: False
- `push_to_hub`: False
- `hub_private_repo`: None
- `hub_model_id`: None
- `hub_strategy`: every_save
- `hub_always_push`: False
- `hub_revision`: None
- `load_best_model_at_end`: False
- `ignore_data_skip`: False
- `restore_callback_states_from_checkpoint`: False
- `full_determinism`: False
- `seed`: 42
- `data_seed`: None
- `use_cpu`: False
- `accelerator_config`: {'split_batches': False, 'dispatch_batches': None, 'even_batches': True, 'use_seedable_sampler': True, 'non_blocking': False, 'gradient_accumulation_kwargs': None}
- `parallelism_config`: None
- `dataloader_drop_last`: False
- `dataloader_num_workers`: 0
- `dataloader_pin_memory`: True
- `dataloader_persistent_workers`: False
- `dataloader_prefetch_factor`: None
- `remove_unused_columns`: True
- `label_names`: None
- `train_sampling_strategy`: random
- `length_column_name`: length
- `ddp_find_unused_parameters`: None
- `ddp_bucket_cap_mb`: None
- `ddp_broadcast_buffers`: False
- `ddp_backend`: None
- `ddp_timeout`: 1800
- `fsdp`: []
- `fsdp_config`: {'min_num_params': 0, 'xla': False, 'xla_fsdp_v2': False, 'xla_fsdp_grad_ckpt': False}
- `deepspeed`: None
- `debug`: []
- `skip_memory_metrics`: True
- `do_predict`: False
- `resume_from_checkpoint`: None
- `warmup_ratio`: None
- `local_rank`: -1
- `prompts`: None
- `batch_sampler`: batch_sampler
- `multi_dataset_batch_sampler`: round_robin
- `router_mapping`: {}
- `learning_rate_mapping`: {}

</details>

### Training Logs
| Epoch | Step | val-triplets_cosine_accuracy |
|:-----:|:----:|:----------------------------:|
| 1.0   | 8    | 0.625                        |


### Framework Versions
- Python: 3.13.1
- Sentence Transformers: 5.2.3
- Transformers: 5.2.0
- PyTorch: 2.10.0+cpu
- Accelerate: 1.12.0
- Datasets: 4.0.0
- Tokenizers: 0.22.2

## Citation

### BibTeX

#### Sentence Transformers
```bibtex
@inproceedings{reimers-2019-sentence-bert,
    title = "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
    author = "Reimers, Nils and Gurevych, Iryna",
    booktitle = "Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing",
    month = "11",
    year = "2019",
    publisher = "Association for Computational Linguistics",
    url = "https://arxiv.org/abs/1908.10084",
}
```

#### TripletLoss
```bibtex
@misc{hermans2017defense,
    title={In Defense of the Triplet Loss for Person Re-Identification},
    author={Alexander Hermans and Lucas Beyer and Bastian Leibe},
    year={2017},
    eprint={1703.07737},
    archivePrefix={arXiv},
    primaryClass={cs.CV}
}
```

<!--
## Glossary

*Clearly define terms in order to be accessible across audiences.*
-->

<!--
## Model Card Authors

*Lists the people who create the model card, providing recognition and accountability for the detailed work that goes into its construction.*
-->

<!--
## Model Card Contact

*Provides a way for people who have updates to the Model Card, suggestions, or questions, to contact the Model Card authors.*
-->