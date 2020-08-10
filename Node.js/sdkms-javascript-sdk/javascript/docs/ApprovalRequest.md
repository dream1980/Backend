# FortanixSdkmsRestApi.ApprovalRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**requestId** | **String** | UUID uniquely identifying this approval request. | 
**requester** | [**Entity**](Entity.md) |  | 
**createdAt** | **String** | When this approval request was created. | 
**acctId** | **String** | The account ID of the account that this approval request belongs to. | 
**operation** | **String** | Operation URL path, e.g. &#x60;/crypto/v1/keys&#x60;, &#x60;/crypto/v1/groups/&lt;id&gt;&#x60;. | 
**method** | **String** | Method for the operation: POST, PATCH, PUT, DELETE, or GET. Default is POST.  | 
**body** | **Object** |  | 
**approvers** | [**[Entity]**](Entity.md) |  | 
**denier** | [**Entity**](Entity.md) |  | 
**status** | [**ApprovalStatus**](ApprovalStatus.md) |  | 
**reviewers** | [**[Entity]**](Entity.md) |  | 
**subjects** | [**[ApprovalSubject]**](ApprovalSubject.md) |  | 
**description** | **String** | Optional comment about the approval request for the reviewer. | [optional] 
**expiry** | **String** | When this approval request expires. | 


