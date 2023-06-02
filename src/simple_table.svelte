<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let table_data = ["today", 1, 2];
	export let labels = [100, 101];
    export let colors = ['red', 'blue', 'green'];
    export let show = [true, true];
    function onClickRow (e) {
        console.log('clicked on row', e.srcElement.parentElement.id);
        dispatch('click', {label: e.srcElement.parentElement.id});
    }
    // table tbody {height:600px; overflow-y:scroll; display:block;} 

</script>

<style>
    table {
        border: 1px solid;
    }
    th, td {
        padding: 5px;
        text-align: center;
        border: 1px solid;
    }
    table thead {border: 1px solid; display: block;}
    table tbody {height: 90vh; overflow-y:scroll; display:block;}

</style>
{#if table_data.length>0}
{table_data[0]}
{/if}
<table>
	<tr>
		<th>ID </th>
		<th>reading</th>
	</tr>
	{#each table_data as reading,i}
	{#if i>0}
        <!--
        <tr>
        -->
        <tr ID={labels[i]} on:click={onClickRow}>
            {#if (show[i]==false) } 
                <td style="color:black"> {labels[i]} </td>
            {:else}
                <td style="color:{colors[(i-1)%colors.length]}"> {labels[i]} </td>
            {/if}
            <td> {reading} </td>
        </tr>
	{/if}
	{/each}
</table>


